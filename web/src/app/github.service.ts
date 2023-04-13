import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { Octokit } from 'octokit';
import { from } from 'rxjs';
import { GithubAppClientService } from './github-app-client.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private octokit?: Octokit;

  constructor(private _githubAppClientService: GithubAppClientService) { }

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

  public searchRepos(options: { nameQuery?: string, userQuery?: string, repos?: string[], page: number, per_page: number }) {
    const params = {
      q: '',
      page: options.page,
      per_page: options.per_page
    }
    const queries: string[] = []
    if (!isEmpty(options.nameQuery)) {
      queries.push(`${options.nameQuery} in:name`);
    }
    if (!isEmpty(options.userQuery)) {
      queries.push(`user:${options.userQuery}`);
    }
    if (options.repos && !isEmpty(options.repos)) {
      const query = options.repos.map(repo => `repo:${repo}`).join(' ');
      queries.push(query);
    }
    params.q = queries.join(' ');

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

  public getUserAccessToken(code: string) {
    return this._githubAppClientService.getUserAccessToken(code);
  }
}
