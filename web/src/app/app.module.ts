import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// My Components
import { AppComponent } from './app.component';
import { WorkflowTableComponent } from './workflow-table/workflow-table.component';
import { RepoWorkflowsComponent } from './repo-workflows/repo-workflows.component';
import { RepoSelectorComponent } from './repo-selector/repo-selector.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { DeploymentReviewDialogComponent } from './deployment-review-dialog/deployment-review-dialog.component';

// Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoadingComponent } from './loading/loading.component';




@NgModule({
  declarations: [
    AppComponent,
    AuthFormComponent,
    RepoSelectorComponent,
    RepoWorkflowsComponent,
    WorkflowTableComponent,
    DeploymentReviewDialogComponent,
    NavigationComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
