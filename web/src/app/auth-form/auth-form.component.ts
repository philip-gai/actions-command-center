import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GithubService } from '../github.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent {
  public authForm = this.fb.group({
    token: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(private fb: FormBuilder, public _userService: UserService, public _githubService: GithubService, private _snackBar: MatSnackBar, private _router: Router) {
    this.authForm.setValue({
      token: this._userService.Token ?? null,
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }
    this._userService.Token = this.authForm.value.token?.trim();
    setTimeout(() => {
      if (!this._userService.isUserLoggedIn()) {
        this.authForm.controls['token'].setErrors({ badToken: true });
      } else {
        this._snackBar.open(`@${this._userService.Username} logged in`, 'Dismiss', { duration: 3000 });
        this._router.navigateByUrl("/repo/select");
      }
    }, 500);
  }
}
