import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private octokit?: Octokit;

  public async updateOctokit(token: string): Promise<void> {
    this.octokit = new Octokit({ auth: token });
    console.log("Octokit initialized");
  }

  public clearOctokit(): void {
    this.octokit = undefined;
    console.log("Octokit destroyed");
  }

  public listReposForAuthenticatedUser(options: { page: number, per_page: number, affiliation: string }) {
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.repos.listForAuthenticatedUser(options))
  }

  public searchRepos(options: { repo: string, page: number, per_page: number }) {
    const params = {
      q: `${options.repo} in:name`,
      page: options.page,
      per_page: options.per_page
    }
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.search.repos(params)).pipe(
      tap((response) => console.debug(response))
    );
  }

  public getAuthenticatedUser() {
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.users.getAuthenticated())
  }

  public listActionableWorkflowRuns(options: { repoFullName: string }) {
    const [owner, repo] = options.repoFullName.split("/");
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.actions.listWorkflowRunsForRepo({ owner: owner, repo: repo, status: "waiting", per_page: 100 }));
  }
}
