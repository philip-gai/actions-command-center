import { GitHubAppUserAuthenticationWithExpiration } from "@octokit/auth-oauth-app";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubAppClientService {

  constructor(private _httpClient: HttpClient) { }

  public getUserAccessToken(code: string) {
    return this._httpClient.get<GitHubAppUserAuthenticationWithExpiration>('http://localhost:7071/api/github/login/oauth/access_token', { params: { code } });
  }
}
