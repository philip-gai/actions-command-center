import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { debounce, includes } from 'lodash';
import { map, Observable, of, tap } from 'rxjs';
import { GithubService } from '../github.service';
import { RepoService } from '../repo.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.scss']
})
export class RepoSelectorComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<RepoSelectorItem>;

  displayedColumns = ['repo', 'actions'];
  data$: Observable<RepoSelectorItem[]> = of();
  totalCount = 0;
  initialSearch: string;
  lastQuery?: string;

  constructor(private _githubService: GithubService, private _userService: UserService, private _repoService: RepoService, private _snackBar: MatSnackBar) {
    this.initialSearch = this._userService.Username || "defunkt";
  }

  ngAfterViewInit(): void {
    this.getInitialData();
  }

  onRepositorySearch = debounce(this._onRepositorySearch, 500);

  onRepoSelected(repo: string, index: number) {
    this._repoService.addRepo(repo);

    // TODO: Remove from table
    console.debug(`Selected repo ${repo} at index ${index}`);

    // Refresh after changing the data
    this.searchRepos(this.lastQuery || this.initialSearch).pipe(
      tap((repos) => {
        this.data$ = of(repos);
        this._snackBar.open(`Added ${repo}`, "Dismiss", { duration: 3000 })
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
          return { repo: repo.full_name } as RepoSelectorItem;
        }).filter((item) => {
          return !includes(this._repoService.repos, item.repo)
        });
        return data;
      })
    );
  }
}

interface RepoSelectorItem {
  repo: string;
}
