import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { debounce, includes, isEmpty } from 'lodash';
import { map, Observable, of, tap } from 'rxjs';
import { GithubService } from '../github.service';
import { RepoAction } from '../repo-table/repo-table.component';
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

  totalSearchCount = 0;
  lastQuery?: string;
  totalFollowCount = 0;
  followedRepos$: Observable<Repository[]> = of();
  initialSearch: string;
  followedRepos?: Repository[];
  searchedRepos?: Repository[];

  constructor(private _githubService: GithubService, private _userService: UserService, private _repoService: RepoService) {
    this.initialSearch = this._userService.Username || '';
    this.lastQuery = this.initialSearch;
  }

  ngAfterViewInit(): void {
    this.getInitialData();
    // TODO - pagination
  }

  onRepositorySearch = debounce(this._onRepositorySearch, 500);

  onRepoAction = (repo: Repository, action: RepoAction) => {
    if (action === 'follow') {
      this.followedRepos = this.followedRepos?.concat(repo);
      this.totalFollowCount++;
      if (this.searchedRepos) {
        this.searchedRepos.splice(this.searchedRepos.indexOf(repo), 1);
        this.searchedRepos = this.searchedRepos.slice();
        this.totalSearchCount--;
      }
      this._repoService.addRepo(repo.full_name);
    } else if (action === 'unfollow') {
      this.searchedRepos = this.searchedRepos?.concat(repo);
      this.totalSearchCount++;
      if (this.followedRepos) {
        this.followedRepos.splice(this.followedRepos.indexOf(repo), 1);
        this.followedRepos = this.followedRepos.slice();
        this.totalFollowCount--;
      }
      this._repoService.removeRepo(repo.full_name);
    }
  }

  private getInitialData() {
    this.searchRepos({ userQuery: this.initialSearch }).subscribe();
    this.getFollowedRepos(this._repoService.repos).subscribe();
  }

  private _onRepositorySearch(event: Event) {
    this.searchedRepos = undefined;
    const target = event.target as HTMLInputElement;
    const nameQuery = target.value.trim();
    if (!nameQuery) {
      this.getInitialData();
    }
    else {
      this.lastQuery = nameQuery;
      this.searchRepos({ nameQuery: nameQuery }).subscribe();
    }
  }

  private searchRepos(options: { nameQuery?: string, userQuery?: string }) {
    if (!isEmpty(options.nameQuery)) {
      if (options.nameQuery === this._userService.Username) {
        options.userQuery = this._userService.Username;
        delete options.nameQuery;
      } else {
        delete options.userQuery;
      }
    }
    return this._githubService.searchRepos({ ...options, page: 1, per_page: 25 }).pipe(
      map((response) => {
        this.totalSearchCount = response.data.total_count - this._repoService.repos.length;
        return response.data.items;
      }),
      map((repos) => {
        const data = repos?.map((repo) => {
          return repo as Repository;
        }).filter((item) => {
          const isFollowed = includes(this._repoService.repos, item.full_name);
          return !isFollowed
        });
        return data;
      }),
      tap((repos) => {
        this.searchedRepos = repos;
      })
    );
  }

  private getFollowedRepos(repos: string[]) {
    return this._githubService.searchRepos({ repos, page: 1, per_page: 25 }).pipe(
      map((response) => {
        this.totalFollowCount = response.data.total_count;
        return response.data.items;
      }),
      map((repos) => {
        const data = repos?.map((repo) => {
          return repo as Repository;
        });
        return data;
      }),
      tap((repos) => {
        this.followedRepos = repos;
      })
    );
  }
}
