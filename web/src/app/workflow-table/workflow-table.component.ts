import { Component, Input } from '@angular/core';
import { RepoService } from '../repo.service';
import { WorkflowRunResponse } from '../workflow-run-response';

@Component({
  selector: 'app-workflow-table',
  templateUrl: './workflow-table.component.html',
  styleUrls: ['./workflow-table.component.scss']
})
export class WorkflowTableComponent {
  @Input() public workflowRuns?: WorkflowRunResponse | null;
  displayedColumns = ["workflow", "repo", "actions"];
  totalCount = 0;

  constructor(private _repoService: RepoService) { }

  removeRepo(repo: string) {
    this._repoService.removeRepo(repo);
  }
}
