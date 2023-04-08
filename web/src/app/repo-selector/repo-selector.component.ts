import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { debounce, includes } from 'lodash';
import { map, Observable, of, tap } from 'rxjs';
import { GithubService } from '../github.service';
import { RepoService } from '../repo.service';
import { Repository } from '../repository';
import { UserService } from '../user.service';

@Component({
  selector: 'app-repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.scss']
})
export class RepoSelectorComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Repository>;

  data$: Observable<Repository[]> = of();
  totalCount = 0;
  initialSearch: string;
  lastQuery?: string;
  @Output() repoSelected = new EventEmitter<null>();

  constructor(private _githubService: GithubService, private _userService: UserService, private _repoService: RepoService) {
    this.initialSearch = this._userService.Username || "defunkt";
  }

  ngAfterViewInit(): void {
    this.getInitialData();
    // TODO - pagination
  }

  onRepositorySearch = debounce(this._onRepositorySearch, 500);

  onRepoSelected(repo: string) {
    this._repoService.addRepo(repo);
    this.repoSelected.emit(null);

    // Refresh after changing the data
    this.searchRepos(this.lastQuery || this.initialSearch).pipe(
      tap((repos) => {
        this.data$ = of(repos);
      })
    ).subscribe();
  }

  private getInitialData() {
    this.data$ = this.searchRepos(this.initialSearch)
  }

  private _onRepositorySearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const newQuery = target.value.trim();
    if (!newQuery) {
      this.getInitialData();
    }
    else {
      this.data$ = this.searchRepos(newQuery);
    }
  }

  private searchRepos(newQuery: string) {
    this.lastQuery = newQuery;
    return this._githubService.searchRepos({ repo: newQuery, page: 1, per_page: 25 }).pipe(
      map((response) => {
        this.totalCount = response.data.total_count - this._repoService.repos.length;
        return response.data.items;
      }),
      map((repos) => {
        const data = repos?.map((repo) => {
          return repo as Repository;
        }).filter((item) => {
          return !includes(this._repoService.repos, item.full_name)
        });
        return data;
      })
    );
  }
}
