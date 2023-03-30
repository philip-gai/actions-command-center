import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Deployment } from './deployment';
import { GithubService } from './github.service';
import { WorkflowRun } from './workflow-run';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private _githubService: GithubService) { }

  listWaitingWorkflowRuns(repo: string) {
    return this._githubService.listWaitingWorkflowRuns({ repoFullName: repo });
  }

  listWaitingWorkflowRunsForRepos(repos: string[]): Observable<WorkflowRunResponse> {
    const observables = repos.map((repo) => this.listWaitingWorkflowRuns(repo));
    return forkJoin(observables).pipe(
      map(responses => responses.map(response => response.data)),
      map((responses) => {
        const combinedResult: WorkflowRunResponse
          = {
          total_count: 0,
          workflow_runs: []
        }
        responses.forEach((result) => {
          combinedResult.total_count += result.total_count;
          combinedResult.workflow_runs = combinedResult.workflow_runs.concat(result.workflow_runs);
        });
        return combinedResult;
      })
    )
  }

  getPendingDeploymentsForRun(workflowRun: WorkflowRun): Observable<Deployment[]> {
    return this._githubService.getPendingDeploymentsForRun({ repoFullName: workflowRun.repository.full_name, run_id: workflowRun.id }).pipe(
      map(responses => responses.data)
    )
  }

  reviewPendingDeploymentForRun(workflowRun: WorkflowRun, environment_ids: number[], state: 'approved' | 'rejected', comment: string) {
    console.log(environment_ids)
    return this._githubService.reviewPendingDeploymentForRun({ repoFullName: workflowRun.repository.full_name, run_id: workflowRun.id, environment_ids, comment, state }).pipe(
      map(responses => responses.data)
    )
  }
}

type WorkflowRunResponse = {
  total_count: number,
  workflow_runs: WorkflowRun[]
}
