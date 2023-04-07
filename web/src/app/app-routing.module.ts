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
        path: 'repo',
        component: RepoSelectorComponent,
        children: [
          {
            path: 'select',
            component: RepoWorkflowsComponent,
          },
          {
            path: '**',
            redirectTo: '/repo/select'
          }
        ]
      },
      {
        path: 'user',
        component: AuthFormComponent,
        children: [
          {
            path: 'login',
            component: AuthFormComponent,
          },
          {
            path: '**',
            redirectTo: '/user'
          }
        ]
      },
      {
        path: 'workflow',
        component: RepoWorkflowsComponent,
        children: [
          {
            path: 'approvals',
            component: RepoWorkflowsComponent,
          },
          {
            path: '**',
            redirectTo: '/workflow/approvals'
          }
        ]
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
