import { CreepMiner } from "controllers/creeps/CreepMiner";
import { CreepUpgrader } from "controllers/creeps/CreepUpgrader";
import { RoleInfo } from "utils/config/RoleInfo";
import { RoleConfig } from "utils/config/RoleConfig";
import { RoleList } from "utils/config/RoleList";
import { CreepBuilder } from "controllers/creeps/CreepBuilder";

const miner: RoleInfo = {
  class: CreepMiner,
  name: "miner",
  count: 1,
  config: {
    work: 1,
    carry: 1,
    move: 1
  }
}

const upgrader: RoleInfo = {
  class: CreepUpgrader,
  name: "upgrader",
  count: 1,
  config: {
    work: 1,
    carry: 1,
    move: 1
  }
}

const builder: RoleInfo = {
  class: CreepBuilder,
  name: "builder",
  count: 2,
  config: {
    work: 1,
    carry: 1,
    move: 1
  }
}

const roleList: RoleList = {
  "miner": miner,
  "upgrader": upgrader,
  "builder": builder
}

export const cfg = {
  "roles": roleList
}
