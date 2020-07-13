import { Status } from "utils/Status";

export class CreepBase {
	protected creep: Creep;

	constructor(creep: Creep) {
		this.creep = creep;
	}

	protected mine(): Status {
		const target: Source | null = this.creep.pos.findClosestByPath(FIND_SOURCES);

		if (!target)
			return new Status(ERR_NOT_FOUND, "No active sources found in the room");

		let r: number;
		switch (r = this.creep.harvest(target)) {
			case ERR_NOT_IN_RANGE:
				this.creep.moveTo(target);
			case ERR_BUSY:
			case OK:
				return new Status(OK);
			case ERR_NOT_ENOUGH_RESOURCES:
				return new Status(r, "Source is empty");
			case ERR_NO_BODYPART:
				return new Status(r, "No WORK bodypart, are you crazy, man?");
			default:
				return new Status(r, `${+r}, IDK WTF`);
		}
	}

	/**
	 * High-Level Commands
	 */

	protected takeResoures() {
		let stageName = "";
		// Stage 1: From containers
		stageName = "Containers";
		let r: Status = this.takeEnergyFromContainer();
		if (+r == OK || +r == ERR_BUSY)
			return new Status(OK);
		if (+r != ERR_NOT_FOUND && +r != ERR_NOT_ENOUGH_ENERGY)
			return new Status(+r, `[${stageName}] ` + r.message);

		// Stage 2: Mine it!
		stageName = "Mining";
		r = this.mine();
		if (+r == OK || +r == ERR_BUSY)
			return new Status(OK);
		if (+r != ERR_NOT_FOUND && +r != ERR_NOT_ENOUGH_ENERGY)
			return new Status(+r, `[${stageName}] ` + r.message);

		// Wait for resources
		console.log(`[INFO] [${this.creep.name}] [${stageName}]: Waiting for source`);
		return new Status(OK);
	}

	/**
	 * SPAWN AND ITS EXTENSION INTERACTIONS
	 */
	protected transferEnergyToSpawn(): Status {
		const targets = <StructureSpawn[] | StructureExtension[]>this.creep.room.find(
			FIND_MY_STRUCTURES, {
			filter: (struct: StructureSpawn | StructureExtension): Boolean =>
				(struct.structureType == STRUCTURE_SPAWN ||
					struct.structureType == STRUCTURE_EXTENSION) &&
				struct.store.getFreeCapacity &&
				struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
		}
		);
		targets.sort((
			a: StructureSpawn | StructureExtension,
			b: StructureSpawn | StructureExtension
		) => b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY));

		if (targets.length == 0) {
			return new Status(ERR_NOT_FOUND, "Spawn is full or doesn't exists");
		}

		const r = this.creep.transfer(targets[0], RESOURCE_ENERGY);
		switch (+r) {
			case ERR_NOT_IN_RANGE:
				this.creep.moveTo(targets[0]);
			case ERR_BUSY:
			case OK:
				return new Status(OK);
			default:
				return new Status(+r, `${+r}, IDK WTF`);
		}
	}

	/**
	 * CONTAINER INTERACTIONS
	 */
	protected takeEnergyFromContainer(): Status {
		const targets = <StructureContainer[]>this.creep.room.find(
			FIND_STRUCTURES,
			{
				filter: (struct: StructureContainer): Boolean =>
					struct.structureType == STRUCTURE_CONTAINER &&
					struct.store.getUsedCapacity(RESOURCE_ENERGY) > this.creep.store.getFreeCapacity(RESOURCE_ENERGY)
			}
		);

		if (targets.length == 0) {
			return new Status(ERR_NOT_FOUND, "No container with enough energy found");
		}

		let target: StructureContainer = targets[0];
		for (const struct of targets)
			if (this.creep.pos.findPathTo(struct).length < this.creep.pos.findPathTo(target).length)
				target = struct;

		let r: number;
		switch (r = this.creep.withdraw(target, RESOURCE_ENERGY)) {
			case ERR_NOT_IN_RANGE:
				this.creep.moveTo(target);
			case OK:
			case ERR_BUSY:
				return new Status(OK);
			case ERR_NOT_ENOUGH_RESOURCES:
				return new Status(r, "Not enough energy in container");
			default:
				return new Status(r, `IDK WTF: ${+r}`);
		}
	}

	public transferEnergyToContainer(): Status {
		const target = <StructureContainer>this.creep.pos.findClosestByPath(
			FIND_STRUCTURES,
			{
				filter: (struct: StructureContainer): Boolean =>
					(struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_SPAWN) &&
					struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
			}
		)

		if (!target) {
			return new Status(ERR_NOT_FOUND, "All containers are full or doesn't exist");
		}

		let r = this.creep.transfer(target, RESOURCE_ENERGY);
		switch (r) {
			case ERR_NOT_IN_RANGE:
				this.creep.moveTo(target);
			case OK:
			case ERR_BUSY:
				return new Status(OK);
			default:
				return new Status(r, `IDK WTF: ${+r}`);
		}
	}
}


