import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { GithubService } from './github.service';
import { isEmpty } from 'lodash';

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
    value ? localStorage.setItem(this.usernameKey, value) : localStorage.removeItem(this.usernameKey);
  }

  private _Token?: string | null | undefined;
  public get Token(): string | null | undefined {
    return this._Token;
  }
  public set Token(value: string | null | undefined) {
    this._Token = value;
    if (value) {
      localStorage.setItem(this.tokenKey, value)
      this._githubService.UpdateOctokit(value);
      this._githubService.getAuthenticatedUser().pipe(
        tap((response) => {
          this.Username = response.data.login;
        })
      ).subscribe();
    } else {
      localStorage.removeItem(this.tokenKey)
      this.Username = null;
    }
  }

  constructor(private _githubService: GithubService) {
    this.Username = localStorage.getItem(this.usernameKey);
    this.Token = localStorage.getItem(this.tokenKey);
  }

  public ClearUser(): void {
    this.Username = null;
    this.Token = null;
    this._githubService.ClearOctokit();
  }

  public IsUserComplete(): boolean {
    const isUserFormComplete = !isEmpty(this.Username) && !isEmpty(this.Token)
    return isUserFormComplete;
  }
}