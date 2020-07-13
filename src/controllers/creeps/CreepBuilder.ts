import { CreepBase } from "./CreepBase";
import { Status } from "utils/Status";

export class CreepBuilder extends CreepBase {
  public run() {
    let stageName: string;

    if (this.creep.memory.building && this.creep.store.getUsedCapacity() == 0)
      this.creep.memory.building = false;

    if (!this.creep.memory.building && this.creep.store.getFreeCapacity() == 0)
      this.creep.memory.building = true;

    // Stage: Building
    stageName = "Building";
    if (this.creep.memory.building) {
      const r = this.build();
      if (+r != OK && +r != ERR_BUSY) {
        console.log(`[ERROR] [${this.creep.name}] [${stageName}] ${r.message} (${r.value})`);
      }
      return r;
    }

    // Stage: Collecting
    stageName = "Collecting";
    if (!this.creep.memory.building) {
      const r = this.takeResoures();
      if (+r != OK && +r != ERR_BUSY) {
        console.log(`[ERROR] [${this.creep.name}] [${stageName}] ${r.message} (${r.value})`);
      }

    }

    return new Status(OK);
  }


  private build() {
    const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (!target)
      return new Status(ERR_NOT_FOUND);

    const r = this.creep.build(target);
    switch (r) {
      case ERR_NOT_IN_RANGE:
        this.creep.moveTo(target);
      case OK:
        return new Status(OK);
      default:
        return new Status(r, `IDK WTF ${r}`);
    }
  }
}
