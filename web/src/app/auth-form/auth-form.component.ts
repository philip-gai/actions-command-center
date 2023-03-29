import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent {
  authForm = this.fb.group({
    username: new FormControl<string | null>(null, Validators.required),
    token: new FormControl<string | null>(null, Validators.required),
  });

  constructor(private fb: FormBuilder, public _userService: UserService) {
    this.authForm.setValue({
      username: this._userService.Username ?? null,
      token: this._userService.Token ?? null,
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }
    this._userService.Username = this.authForm.value.username?.replace('@', '').trim();
    this._userService.Token = this.authForm.value.token?.trim();
  }

  missingUserInfo(): boolean {
    const isMissingUserInfo = !this._userService.Username || !this._userService.Token;
    return isMissingUserInfo;
  }

  onLogout(): void {
    this._userService.ClearUser();
    this.authForm.reset();
  }
}
