import { CreepBase } from "controllers/creeps/CreepBase";
import { RoleConfig } from "./RoleConfig";
export interface RoleInfo {
  class: any;
  count: number;
  name: string;
  config: RoleConfig;
}
