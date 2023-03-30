import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs';
import { DeploymentReviewDialogData } from '../deployment-review-dialog-data';
import { DeploymentReviewDialogComponent } from '../deployment-review-dialog/deployment-review-dialog.component';
import { RepoService } from '../repo.service';
import { WorkflowRunResponse } from '../workflow-run-response';

@Component({
  selector: 'app-workflow-table',
  templateUrl: './workflow-table.component.html',
  styleUrls: ['./workflow-table.component.scss']
})
export class WorkflowTableComponent {

  @Input() public workflowRuns?: WorkflowRunResponse | null;
  @Output() public runReviewed = new EventEmitter<null>();

  displayedColumns = ["id", "workflow", "triggered_by", "started_at", "repo", "actions"];
  totalCount = 0;

  constructor(private _repoService: RepoService, public dialog: MatDialog) { }

  removeRepo(repo: string) {
    this._repoService.removeRepo(repo);
  }

  openDialog(data: DeploymentReviewDialogData) {
    const dialogRef = this.dialog.open(DeploymentReviewDialogComponent, { data });
    dialogRef.afterClosed().pipe(
      // Delay so that the workflow can start running before we refresh the table
      delay(5000)
    )
      .subscribe(result => {
        if (result === "approved" || result === "rejected") {
          this.runReviewed.emit();
        }
      });
  }
}
