import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private octokit?: Octokit;

  public async UpdateOctokit(token: string): Promise<void> {
    this.octokit = new Octokit({ auth: token });
    console.log("Octokit initialized");
  }

  public ClearOctokit(): void {
    this.octokit = undefined;
    console.log("Logged out");
  }

  public ListReposForAuthenticatedUser(options: { page: number, per_page: number, affiliation: string }) {
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.repos.listForAuthenticatedUser(options))
  }

  public async SearchRepos(options: { q: string, page: number, per_page: number }): Promise<void> {
    const repos = await this.octokit?.rest.search.repos(options)
    console.log(repos?.data);
  }

  public async UserIsLoggedIn(): Promise<boolean> {
    if (!this.octokit) {
      return false;
    }
    const response = await this.octokit.rest.users.getAuthenticated();
    console.log("Logged in: " + response.data.login);
    return true;
  }
}
