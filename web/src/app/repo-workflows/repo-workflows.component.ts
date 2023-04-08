import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { DeploymentReviewDialogData } from '../deployment-review-dialog-data';
import { RepoService } from '../repo.service';
import { WorkflowRunResponse } from '../workflow-run-response';
import { WorkflowService } from '../workflow.service';

@Component({
  selector: 'app-repo-workflows',
  templateUrl: './repo-workflows.component.html',
  styleUrls: ['./repo-workflows.component.scss']
})
export class RepoWorkflowsComponent implements OnInit {
  repos$: Observable<string[]> = of();
  workflowRuns?: WorkflowRunResponse;

  constructor(private _workflowService: WorkflowService, private _repoService: RepoService) { }

  ngOnInit(): void {
    this.repos$ = this._repoService.repos$.pipe(
      tap((repos) => {
        this.loadWorkflowRuns(repos).subscribe();
      })
    );
  }

  refreshWorkflows() {
    this.workflowRuns = undefined;
    this.loadWorkflowRuns(this._repoService.repos).subscribe();
  }

  onRunReviewed(reviewData: DeploymentReviewDialogData) {
    if (reviewData && this.workflowRuns) {
      const tempWorkflowRuns = this.workflowRuns;
      tempWorkflowRuns.total_count--;
      tempWorkflowRuns.workflow_runs.splice(tempWorkflowRuns.workflow_runs.findIndex((run) => run.id === reviewData.workflowRun.id), 1);
      tempWorkflowRuns.workflow_runs = tempWorkflowRuns.workflow_runs.slice();
      this.workflowRuns = tempWorkflowRuns;
    }
  }

  loadWorkflowRuns(repos: string[]) {
    return this._workflowService.listWaitingWorkflowRunsForRepos(repos).pipe(
      tap((workflowRuns) => {
        this.workflowRuns = workflowRuns;
      })
    );
  }
}
