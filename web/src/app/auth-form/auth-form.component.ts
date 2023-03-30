import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, public _userService: UserService, public _githubService: GithubService) {
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
      if (!this._userService.isUserComplete()) {
        this.authForm.controls['token'].setErrors({ badToken: true });
      }
    }, 200);
  }

  public get isUserComplete(): boolean {
    return this._userService.isUserComplete();
  }

  onLogout(): void {
    this._userService.logoutUser();
    this.authForm.reset();
  }
}
