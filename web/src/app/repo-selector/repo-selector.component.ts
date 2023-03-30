import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { map, Observable, of } from 'rxjs';
import { GithubService } from '../github.service';

@Component({
  selector: 'app-repo-selector',
  templateUrl: './repo-selector.component.html',
  styleUrls: ['./repo-selector.component.scss']
})
export class RepoSelectorComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<RepoSelectorItem>;

  displayedColumns = ['owner', 'repo'];
  data$: Observable<RepoSelectorItem[]> = of();

  constructor(private _githubService: GithubService) {
  }

  ngAfterViewInit(): void {
    this.data$ = this._githubService.ListReposForAuthenticatedUser({ page: 1, per_page: 25, affiliation: "owner" }).pipe(
      map((response) => response.data),
      map((repos) => {
        const data = repos?.map((repo) => {
          return { repo: repo.name, owner: repo.owner.login } as RepoSelectorItem;
        })
        return data;
      })
    );
  }

  onOwnerFilterChange(event: Event): void {
    // TODO: Filter by owner
    console.log(event);
  }
}

interface RepoSelectorItem {
  repo: string;
  owner: string;
}
