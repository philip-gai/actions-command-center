import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { GithubService } from './github.service';
import { isEmpty } from 'lodash';
import { RepoService } from './repo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usernameKey = 'user.username';
  private readonly tokenKey = 'user.token';

  private _Username?: string | null | undefined;
  initialized = false;
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
      this._githubService.updateOctokit(value);
      this._githubService.getAuthenticatedUser().pipe(
        map((response) => response.data.login),
        tap((username) => this.Username = username),
        catchError(() => {
          this.logoutUser(false);
          return of();
        })
      ).subscribe();
    } else {
      localStorage.removeItem(this.tokenKey)
      this.Username = null;
    }
  }

  constructor(private _githubService: GithubService, private _repoService: RepoService, private _snackBar: MatSnackBar) {
    this.init();
  }

  public init() {
    if (!this.initialized) {
      this.initialized = true;
      this.Username = localStorage.getItem(this.usernameKey);
      this.Token = localStorage.getItem(this.tokenKey);
    }
  }

  public logoutUser(showSnackBar = true): void {
    const usernameBefore = this.Username;
    this.Username = null;
    this.Token = null;
    this._githubService.clearOctokit();
    this._repoService.clearRepos();
    if (showSnackBar) {
      this._snackBar.open(`@${usernameBefore} logged out`, "Dismiss", { duration: 3000 })
    }
  }

  public isUserLoggedIn(): boolean {
    const isUserLoggedIn = !isEmpty(this.Username) && !isEmpty(this.Token)
    return isUserLoggedIn;
  }
}
