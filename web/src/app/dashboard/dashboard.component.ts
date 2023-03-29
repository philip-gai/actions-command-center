import { Component } from '@angular/core';
import { GithubService } from '../github.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private _githubService: GithubService) {
  }

  public async UserIsLoggedIn(): Promise<boolean> {
    return await this._githubService.UserIsLoggedIn();
  }
}
