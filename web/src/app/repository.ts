import { Actor } from "./actor";

export interface Repository {
  name: string;
  full_name: string;
  owner: Actor;
  html_url: string;
  deployments_url: string;
}
