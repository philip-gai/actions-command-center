import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { RepoService } from '../repo.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  title = 'Actions Command Center';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private _userService: UserService, private _router: Router, private _repoService: RepoService) {
    // If the user is not logged in, redirect to login
    if (!this.isUserLoggedIn) {
      this._router.navigateByUrl('/user/login');
      return
    }

    // User is logged in
    const routeUrl = this._router.url;
    if (["/", "/user/login"].includes(routeUrl)) {
      // If the user is logged in, but has no repos, redirect to repo select
      if (isEmpty(this.repos)) {
        this._router.navigateByUrl('/repo/select');
        return
      }
      // If the user is logged in, and has repos, redirect to approvals
      this._router.navigateByUrl('/workflow/approvals');
      return
    }

    // If the user has not selected a repo, redirect to repo select
    if(routeUrl === '/workflow/approvals' && isEmpty(this.repos)) {
      this._router.navigateByUrl('/repo/select');
      return
    }
  }

  onLogout(): void {
    this._userService.logoutUser();
    this._router.navigateByUrl('/user/login');
  }

  public get isUserLoggedIn(): boolean {
    return this._userService.isUserLoggedIn();
  }

  public get repos(): string[] {
    return this._repoService.repos;
  }

  public get logoutButtonTooltip() {
    return `Logout @${this.username}`
  }

  public get username() {
    return this._userService.Username;
  }

  // Repo menu item

  public get repoMenuItemLink() {
    return this.isUserLoggedIn ? '/repo/select' : null;
  }

  public get isRepoButtonDisabled() {
    return !this.isUserLoggedIn;
  }

  public get repoButtonTooltip() {
    if (!this.isUserLoggedIn) {
      return 'Login to select a repo';
    }
    return '';
  }

  // Pending workflow menu item

  public get pendingWorkflowMenuItemLink() {
    return this.isPendingWorkflowButtonDisabled ? null : '/workflow/approvals';
  }

  public get isPendingWorkflowButtonDisabled() {
    return !this.isUserLoggedIn || isEmpty(this.repos);
  }

  public get pendingWorkflowButtonTooltip() {
    if (!this.isUserLoggedIn) {
      return 'Login to view pending workflow approvals';
    }
    if (isEmpty(this.repos)) {
      return 'Select a repo to view pending workflows';
    }
    return '';
  }
}
