import { Injectable, OnDestroy } from '@angular/core';
import { isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RepoService implements OnDestroy {
  repos: string[] = [];
  repoKey = 'selectedRepos';

  addRepo(repo: string) {
    this.repos.push(repo);
    this.saveRepos();
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

  clearRepos() {
    this.repos = [];
    this.saveRepos();
  }

  constructor() {
    this.loadRepos();
  }

  ngOnDestroy() {
    this.saveRepos();
  }
}
