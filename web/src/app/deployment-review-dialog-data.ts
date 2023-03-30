import { WorkflowRun } from "./workflow-run";

export interface DeploymentReviewDialogData {
  workflowRun: WorkflowRun
  action: 'approve' | 'reject'
}
