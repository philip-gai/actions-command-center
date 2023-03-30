import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private _userService: UserService) { }

  public get isUserComplete$(): Observable<boolean> {
    return this._userService.IsUserComplete();
  }
}
