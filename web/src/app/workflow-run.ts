import { Actor } from "./actor";
import { Repository } from "./repository";

export interface WorkflowRun {
  id: number;
  name?: string | null;
  display_title?: string | null;
  html_url: string;
  triggering_actor?: Actor
  cancel_url: string;
  repository: Repository
  run_started_at?: string;
}
