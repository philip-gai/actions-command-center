import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private octokit?: Octokit;

  public async UpdateOctokit(token: string): Promise<void> {
    this.octokit = new Octokit({ auth: token });
    const response = await this.octokit.rest.users.getAuthenticated();
    console.log("Logged in: " + response.data.login);
  }

  public ClearOctokit(): void {
    this.octokit = undefined;
    console.log("Logged out");
  }
}
