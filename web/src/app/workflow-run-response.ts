import { WorkflowRun } from "./workflow-run";

export interface WorkflowRunResponse {
  total_count: number,
  workflow_runs: WorkflowRun[]
}
