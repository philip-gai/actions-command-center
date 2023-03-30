import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private _userService: UserService) { }

  public get isUserComplete(): boolean {
    return this._userService.isUserComplete();
  }
}
