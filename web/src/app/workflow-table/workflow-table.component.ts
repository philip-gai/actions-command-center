import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeploymentReviewDialogData } from '../deployment-review-dialog-data';
import { DeploymentReviewDialogComponent } from '../deployment-review-dialog/deployment-review-dialog.component';
import { WorkflowRunResponse } from '../workflow-run-response';

@Component({
  selector: 'app-workflow-table',
  templateUrl: './workflow-table.component.html',
  styleUrls: ['./workflow-table.component.scss']
})
export class WorkflowTableComponent {

  @Input() public workflowRuns?: WorkflowRunResponse | null;
  @Output() public runReviewed = new EventEmitter<DeploymentReviewDialogData>();

  displayedColumns = ["id", "workflow", "triggered_by", "started_at", "repo", "actions"];
  totalCount = 0;

  constructor(public dialog: MatDialog) { }

  openDialog(data: DeploymentReviewDialogData) {
    const dialogRef = this.dialog.open(DeploymentReviewDialogComponent, { data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "approved" || result === "rejected") {
        this.runReviewed.emit(data);
      }
    });
  }
}
