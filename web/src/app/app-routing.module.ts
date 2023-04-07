import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RepoSelectorComponent } from './repo-selector/repo-selector.component';
import { RepoWorkflowsComponent } from './repo-workflows/repo-workflows.component';

const routes: Routes = [
  {
    path: '', component: NavigationComponent, children: [
      {
        path: 'repo/select',
        component: RepoSelectorComponent
      },
      {
        path: 'user/login',
        component: AuthFormComponent
      },
      {
        path: 'workflow/approvals',
        component: RepoWorkflowsComponent
      }
    ],
  }
  , { path: '**', redirectTo: '/workflow/approvals' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
