import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RepoService implements OnDestroy {
  repos: string[] = [];
  repoKey = 'selectedRepos';

  constructor(private _snackBar: MatSnackBar) {
    this.loadRepos();
  }

  loadRepos() {
    const repos = localStorage.getItem(this.repoKey);
    if (repos && !isEmpty(repos)) {
      this.repos = JSON.parse(repos);
    }
  }

  saveRepos() {
    if (isEmpty(this.repos)) {
      localStorage.removeItem(this.repoKey);
    } else {
      localStorage.setItem(this.repoKey, JSON.stringify(this.repos));
    }
  }

  addRepo(repo: string) {
    this.repos = [...this.repos, repo];
    this.saveRepos();
    this._snackBar.open(`Added ${repo}`, "Dismiss", { duration: 3000 })
  }

  removeRepo(repo: string) {
    const index = this.repos.indexOf(repo);
    if (index > -1) {
      this.repos.splice(index, 1);
      this.repos = [...this.repos];
      this.saveRepos();
      this._snackBar.open(`Removed ${repo}`, "Dismiss", { duration: 3000 })
    }
  }

  clearRepos() {
    this.repos = [];
    this.saveRepos();
  }

  ngOnDestroy() {
    this.saveRepos();
  }
}
