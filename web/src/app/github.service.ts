import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private octokit?: Octokit;

  public async updateOctokit(token: string): Promise<void> {
    this.octokit = new Octokit({ auth: token });
  }

  public clearOctokit(): void {
    this.octokit = undefined;
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
    return from(this.octokit.rest.search.repos(params));
  }

  public getAuthenticatedUser() {
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.users.getAuthenticated())
  }

  public listWaitingWorkflowRuns(options: { repoFullName: string }) {
    const [owner, repo] = options.repoFullName.split("/");
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    // Do not cache this request
    const headers = { 'If-None-Match': '' };
    return from(this.octokit.rest.actions.listWorkflowRunsForRepo({ owner: owner, repo: repo, status: "waiting", per_page: 100, headers }));
  }

  public getPendingDeploymentsForRun(options: { repoFullName: string, run_id: number }) {
    const [owner, repo] = options.repoFullName.split("/");
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    return from(this.octokit.rest.actions.getPendingDeploymentsForRun({ owner: owner, repo: repo, run_id: options.run_id }));
  }

  public reviewPendingDeploymentForRun(options: { repoFullName: string, run_id: number, environment_ids: number[], state: 'approved' | 'rejected', comment: string }) {
    const [owner, repo] = options.repoFullName.split("/");
    if (!this.octokit) {
      throw new Error("Octokit is not initialized");
    }
    const finalOptions = { owner: owner, repo: repo, run_id: options.run_id, environment_ids: options.environment_ids, state: options.state, comment: options.comment };
    return from(this.octokit.rest.actions.reviewPendingDeploymentsForRun(finalOptions));
  }
}
