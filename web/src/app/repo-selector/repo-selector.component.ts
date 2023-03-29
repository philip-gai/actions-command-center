import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { map } from 'rxjs';
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
  data: RepoSelectorItem[] = [];

  constructor(private _githubService: GithubService) {
  }

  ngAfterViewInit(): void {
    this._githubService.ListReposForAuthenticatedUser({ page: 1, per_page: 25, affiliation: "owner" }).pipe(
      map((response) => response.data),
      map((repos) => {
        const data = repos?.map((repo) => {
          return { repo: repo.name, owner: repo.owner.login } as RepoSelectorItem;
        })
        return data;
      })
    ).subscribe(data => {
      this.data = data;
      console.log("Updating data");
    });
  }

  onOwnerFilterChange(event: Event): void {
    const target = event.target as HTMLInputElement;
  }
}

interface RepoSelectorItem {
  repo: string;
  owner: string;
}
