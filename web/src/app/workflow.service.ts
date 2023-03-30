import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { GithubService } from './github.service';
import { RepoService } from './repo.service';
import { WorkflowRun } from './workflow-run';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private _repoService: RepoService, private _githubService: GithubService) { }

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
}

type WorkflowRunResponse = {
  total_count: number,
  workflow_runs: WorkflowRun[]
}
