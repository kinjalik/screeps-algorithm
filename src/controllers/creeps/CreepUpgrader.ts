import { CreepBase } from "./CreepBase";
import { Status } from "utils/Status";

/**
 * Memory:
 *  status: "building" | "upgrading"
 */

export class CreepUpgrader extends CreepBase {
  public run(): Status {
    let stageName = "";

    if (this.creep.memory.upgrading && this.creep.store.getUsedCapacity() == 0) {
      this.creep.memory.upgrading = false;
    }

    if (!this.creep.memory.upgrading && this.creep.store.getFreeCapacity() == 0) {
      this.creep.memory.upgrading = true;
    }

    // Step: Upgrade the controller
    stageName = "Upgrading";
    if (this.creep.memory.upgrading) {
      const r = this.upgradeController();
      if (+r != OK && +r != ERR_BUSY) {
        console.log(`[ERROR] [${this.creep.name}] [${stageName}] ${r.message} (${r.value})`);
      }
      return r;
    }

    // Step: Get resources
    stageName = "Collecting";
    if (!this.creep.memory.upgrading) {
      const r = this.takeResoures();
      if (+r != OK) {
        console.log(`[ERROR] [${this.creep.name}] [${stageName}] ${r.message} (${r.value})`);
      }
      return r;
    }

    return new Status(OK);
  }


  public upgradeController(): Status {
    const target: StructureController = <StructureController>this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (struct): Boolean =>
        struct.structureType == STRUCTURE_CONTROLLER
    });

    if (!target)
      return new Status(ERR_NOT_FOUND);

    const r = this.creep.upgradeController(target);
    switch (r) {
      case ERR_NOT_IN_RANGE:
        this.creep.moveTo(target);
      case OK:
      case ERR_BUSY:
        return new Status(OK);
      default:
        return new Status(r);
    }
  }
}
