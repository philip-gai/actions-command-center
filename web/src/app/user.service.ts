import { Injectable } from '@angular/core';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usernameKey = 'user.username';
  private readonly tokenKey = 'user.token';

  private _Username?: string | null | undefined;
  public get Username(): string | null | undefined {
    return this._Username;
  }
  public set Username(value: string | null | undefined) {
    this._Username = value;
    localStorage.setItem(this.usernameKey, value ?? '');
  }

  private _Token?: string | null | undefined;
  public get Token(): string | null | undefined {
    return this._Token;
  }
  public set Token(value: string | null | undefined) {
    this._Token = value;
    if (!value) return;
    localStorage.setItem(this.tokenKey, value ?? '');
    this._githubService.UpdateOctokit(value ?? '');
  }

  constructor(private _githubService: GithubService) {
    this.Username = localStorage.getItem(this.usernameKey);
    this.Token = localStorage.getItem(this.tokenKey);
  }

  public ClearUser(): void {
    this.Username = null;
    this.Token = null;
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.tokenKey);
    this._githubService.ClearOctokit();
  }
}
