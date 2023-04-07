import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, uniq } from 'lodash';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepoService implements OnDestroy {

  private _repos: string[] = [];
  public get repos(): string[] {
    return this._repos;
  }
  private set repos(value: string[]) {
    this._repos = value;
    this.repos$ = of(value);
  }

  public repos$: Observable<string[]> = of([]);
  private repoKey = 'selectedRepos';

  constructor(private _snackBar: MatSnackBar) {
    this.loadRepos();
  }

  loadRepos() {
    const reposStr = localStorage.getItem(this.repoKey);
    if (reposStr && !isEmpty(reposStr)) {
      const repos = JSON.parse(reposStr) as string[];
      this.repos = repos;
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
    this.repos = uniq([...this.repos, repo]);
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
