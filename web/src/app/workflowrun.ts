import { Actor } from "./actor";
import { Repository } from "./repository";

export interface WorkflowRun {
  name?: string | null;
  html_url: string;
  triggering_actor?: Actor
  cancel_url: string;
  repository: Repository
}
