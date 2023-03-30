import { Component } from '@angular/core';
import { RepoService } from '../repo.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private _userService: UserService, public _repoService: RepoService) { }

  public get isUserComplete(): boolean {
    return this._userService.isUserComplete();
  }

  public get repos(): string[] {
    return this._repoService.repos;
  }
}
