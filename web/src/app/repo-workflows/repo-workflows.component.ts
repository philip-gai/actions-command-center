import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RepoService } from '../repo.service';
import { WorkflowService } from '../workflow.service';

@Component({
  selector: 'app-repo-workflows',
  templateUrl: './repo-workflows.component.html',
  styleUrls: ['./repo-workflows.component.scss']
})
export class RepoWorkflowsComponent implements OnInit {
  repoWorkflows: { [repo: string]: Observable<any> } = {};

  public get repos(): string[] {
    return this._repoService.repos;
  }

  constructor(private _workflowService: WorkflowService, private _repoService: RepoService) { }

  ngOnInit(): void {
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
