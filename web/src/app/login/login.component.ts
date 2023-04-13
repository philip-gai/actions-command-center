import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  get githubLoginUrl(): string {
    let url = `https://github.com/login/oauth/authorize?client_id=${environment.githubAppClientId}`;
    if (!isEmpty(environment.githubRedirectUri)) {
      url += `&redirect_uri=${environment.githubRedirectUri}`;
    }
    return url;
  }
}
