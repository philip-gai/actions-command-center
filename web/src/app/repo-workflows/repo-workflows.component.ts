import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class RepoWorkflowsComponent implements OnInit, OnChanges {
  @Input() public repos: string[] = [];
  repoWorkflowsRuns$: Observable<WorkflowRunResponse> = of();
  reposWithNoWaitingWorkflows: string[] = [];

  constructor(private _workflowService: WorkflowService, private _repoService: RepoService, private _snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void {
    const reposChanges = changes["repos"];
    if (reposChanges && !reposChanges.firstChange) {
      this.loadWorkflowRuns();
    }
  }

  ngOnInit(): void {
    this.loadWorkflowRuns();
  }

  refreshWorkflows() {
    this.loadWorkflowRuns();
    this._snackBar.open("Refreshed workflows", "OK", { duration: 2000 });
  }

  private loadWorkflowRuns() {
    this.repoWorkflowsRuns$ = this._workflowService.listWaitingWorkflowRunsForRepos(this.repos)
      .pipe(
        tap((workflowRuns) => {
          this.reposWithNoWaitingWorkflows = this.repos.filter((repo) => {
            return !workflowRuns.workflow_runs.find((workflowRun) => {
              return workflowRun.repository.full_name === repo;
            });
          });
        })
      );
  }
}
