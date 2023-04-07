import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, tap } from 'rxjs';
import { RepoService } from '../repo.service';
import { WorkflowRunResponse } from '../workflow-run-response';
import { WorkflowService } from '../workflow.service';

@Component({
  selector: 'app-repo-workflows',
  templateUrl: './repo-workflows.component.html',
  styleUrls: ['./repo-workflows.component.scss']
})
export class RepoWorkflowsComponent {
  repoWorkflowsRuns$: Observable<WorkflowRunResponse> = of();
  reposWithNoWaitingWorkflows: string[] = [];
  repos$: Observable<string[]>;

  constructor(private _workflowService: WorkflowService, private _repoService: RepoService) {
    this.repos$ = this._repoService.repos$.pipe(
      tap((repos) => {
        this.loadWorkflowRuns(repos);
      })
    );
  }

  refreshWorkflows() {
    this.loadWorkflowRuns(this._repoService.repos);
  }

  loadWorkflowRuns(repos: string[]) {
    this.repoWorkflowsRuns$ = this._workflowService.listWaitingWorkflowRunsForRepos(repos)
      .pipe(
        tap((workflowRuns) => {
          this.reposWithNoWaitingWorkflows = repos.filter((repo) => {
            return !workflowRuns.workflow_runs.find((workflowRun) => {
              return workflowRun.repository.full_name === repo;
            });
          });
        })
      );
    return this.repoWorkflowsRuns$;
  }
}
