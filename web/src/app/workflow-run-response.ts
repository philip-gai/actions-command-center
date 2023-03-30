import { WorkflowRun } from "./workflowrun";

export interface WorkflowRunResponse {
  total_count: number,
  workflow_runs: WorkflowRun[]
}
