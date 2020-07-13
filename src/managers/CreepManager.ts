import { cfg } from "../config";
import { RoleInfo } from "../utils/config/RoleInfo";
import { Status } from "../utils/Status";
import { RoleConfig } from "utils/config/RoleConfig";

function renewCreeps() {
  for (const role of Object.values(cfg.roles)) {
    const creeps = _.filter(Game.creeps, (creep: Creep) =>
      creep.memory.role == role.name);

    if (creeps.length < role.count) {
      const r = spawnCreep(role);
      if (+r != OK && +r != ERR_BUSY) {
        console.log(`[ERROR] [CreepController] [${role.name}] ${r.message} (${r.value}})`);
      }
      return r;
    }
  }
  return new Status(OK);
}

function assignRoles() {
  for (const [name, creep] of Object.entries(Game.creeps)) {
    const roleName: string = creep.memory.role;
    const Role = cfg.roles[roleName].class;
    const controller = new Role(creep);
    controller.run();
  }
}

function getBodyparts(config: RoleConfig): BodyPartConstant[] {
  let bodyParts: BodyPartConstant[] = [];
  for (const [key, value] of Object.entries(config)) {
    const part: BodyPartConstant = eval(key.toUpperCase());

    let parts: BodyPartConstant[] = [];
    parts.length = value;
    parts = parts.fill(part, 0, value);

    bodyParts = bodyParts.concat(parts);
  }
  return bodyParts;
}

function prepareCreepCounter(role: string): void {
  if (!Memory.counters)
    Memory.counters = {};
  if (!Memory.counters[role])
    Memory.counters[role] = 0;
}

function spawnCreep(role: RoleInfo): Status {
  prepareCreepCounter(role.name);
  let name = role.name.toUpperCase() + "-" + Memory.counters[role.name] % 1000;
  const bodyParts = getBodyparts(role.config)

  const res = Object.values(Game.spawns)[0].spawnCreep(bodyParts, name, {
    memory: {
      role: role.name
    }
  });

  switch (res) {
    case OK:
      break;
    case ERR_BUSY:
      return new Status(res, "Spawn is busy");
    case ERR_NAME_EXISTS:
      return new Status(res, "Creep with the same name already exists!");
    case ERR_NOT_ENOUGH_ENERGY:
      return new Status(res, `Not Enough Energy for spawning a ${role.name}`);
    case ERR_RCL_NOT_ENOUGH:
      return new Status(res, "Room Controller Level is low for this spawn");
  }

  console.log(`[INFO] [CreepManager] ${role.name.toUpperCase()} designated ${name} has been SPAWNED`);
  Memory.counters[role.name]++;

  return new Status(OK);
}

export {
  renewCreeps,
  assignRoles
}
