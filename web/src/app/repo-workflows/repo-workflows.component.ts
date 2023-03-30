import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { RepoService } from '../repo.service';
import { WorkflowService } from '../workflow.service';

@Component({
  selector: 'app-repo-workflows',
  templateUrl: './repo-workflows.component.html',
  styleUrls: ['./repo-workflows.component.scss']
})
export class RepoWorkflowsComponent implements OnInit, OnChanges {
  @Input() public repos: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repoWorkflows: { [repo: string]: Observable<any> } = {};

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

  removeRepo(repo: string) {
    this._repoService.removeRepo(repo);
  }

  refreshWorkflows() {
    this.loadWorkflowRuns();
    this._snackBar.open("Refreshed workflows", "OK", { duration: 2000 });
  }

  private loadWorkflowRuns() {
    for (const repo of this.repos) {
      this.repoWorkflows[repo] = this.getWorkflowRunsForRepo(repo);
    }
  }

  private getWorkflowRunsForRepo(repo: string) {
    return this._workflowService.getActionableWorkflowRuns(repo).pipe(
      map(response => response.data.workflow_runs)
    );
  }
}
