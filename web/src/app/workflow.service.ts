import { Injectable } from '@angular/core';
import { GithubService } from './github.service';
import { RepoService } from './repo.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private _repoService: RepoService, private _githubService: GithubService) { }

  getActionableWorkflowRuns(repo: string) {
    return this._githubService.listActionableWorkflowRuns({ repoFullName: repo });
  }
}
