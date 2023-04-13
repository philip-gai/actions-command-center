import { GitHubAppUserAuthenticationWithExpiration } from "@octokit/auth-oauth-app";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GithubAppClientService {
  accessTokenEndpoint = '/api/github/login/oauth/access_token';

  constructor(private _httpClient: HttpClient) { }

  public getUserAccessToken(code: string) {
    return this._httpClient.get<GitHubAppUserAuthenticationWithExpiration>(`${environment.apiBaseUrl}${this.accessTokenEndpoint}`, { params: { code } });
  }
}
