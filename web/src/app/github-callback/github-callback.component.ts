import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../github.service';
import { isEmpty } from 'lodash';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-github-callback',
  templateUrl: './github-callback.component.html',
  styleUrls: ['./github-callback.component.scss']
})

// Test by going to https://github.com/login/oauth/authorize?client_id=Iv1.f3cd5e26efa9f14f
export class GitHubCallbackComponent implements OnInit {
  code?: string;

  constructor(private _activatedRoute: ActivatedRoute, private _githubService: GithubService, private _userService: UserService, private _router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      this.code = params['code'];
      if (this.code && !isEmpty(this.code)) {
        this._githubService.getUserAccessToken(this.code).pipe(
          tap(auth => {
            this._userService.Token = auth.token;
            setTimeout(() => {
              if (this._userService.isUserLoggedIn()) {
                this._snackBar.open(`@${this._userService.Username} logged in`, 'Dismiss', { duration: 3000 });
                this._router.navigateByUrl("/repo/select");
              }
            }, 500);
          }),
          catchError(err => {
            this._snackBar.open(`Error logging in: ${err.error}`, 'Dismiss', { duration: 10000 });
            this._router.navigateByUrl("/user/login");
            return err;
          })
        ).subscribe();
      }
    });
  }
}
