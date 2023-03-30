import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Deployment } from '../deployment';
import { DeploymentReviewDialogData } from '../deployment-review-dialog-data';
import { WorkflowService } from '../workflow.service';

@Component({
  selector: 'app-deployment-review-dialog',
  templateUrl: './deployment-review-dialog.component.html',
  styleUrls: ['./deployment-review-dialog.component.scss']
})
export class DeploymentReviewDialogComponent implements OnInit {
  public reviewForm = this.fb.group({
    comment: new FormControl<string | null>(null, [Validators.required]),
  });

  pendingDeployments$: Observable<Deployment[]> = of();
  loadedDeployments = false;
  primaryActionLabel = "";
  environmentIds: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DeploymentReviewDialogData,
    private _workflowService: WorkflowService,
    public dialogRef: MatDialogRef<DeploymentReviewDialogComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (!this.data.workflowRun) {
      throw new Error("run is required");
    }
    this.primaryActionLabel = this.data.action === 'approve' ? 'Approve' : 'Reject';
    this.pendingDeployments$ = this._workflowService.getPendingDeploymentsForRun(this.data.workflowRun).pipe(
      map((deployments) => deployments.filter((deployment) => deployment.current_user_can_approve)),
      tap((deployments) => {
        this.loadedDeployments = true
        console.log(deployments);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.environmentIds = deployments.map((deployment) => deployment.environment.id!);
        console.log(this.environmentIds);
      })
    );
  }

  closeDialog(result: string) {
    this.dialogRef.close(result);
  }

  onSubmit(): void {
    if (this.reviewForm.invalid || !this.reviewForm.value.comment) {
      return;
    }
    const state = this.data.action === "approve" ? "approved" : "rejected";
    this.closeDialog(state);
    this._workflowService.reviewPendingDeploymentForRun(this.data.workflowRun, this.environmentIds, state, this.reviewForm.value.comment).pipe(
      tap(() => this._snackBar.open(`Deployment ${state}`, "OK", { duration: 2000 })),
      catchError((error) => {
        this._snackBar.open(`Error! ${error.message}`, "OK", { duration: 10000 });
        return of(error);
      })
    ).subscribe();
  }
}
