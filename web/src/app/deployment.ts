import { Environment } from "./environment";

export interface Deployment {
  environment: Environment;
  current_user_can_approve: boolean;
}
