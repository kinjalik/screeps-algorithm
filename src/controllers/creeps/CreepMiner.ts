import { CreepBase } from "./CreepBase";
import { Status } from "utils/Status";

export class CreepMiner extends CreepBase {
	public run(): Status {
		let stageName: string;
		// Stage 1: Mining
		stageName = "Mining";
		if (this.creep.store.getFreeCapacity() > 0) {
			const r: Status = this.mine();
			if (+r == OK) {
				return r;
			}
			if (+r != ERR_NOT_ENOUGH_RESOURCES && +r != ERR_NOT_FOUND) {
				console.log(`[ERROR] [${this.creep.name}] ${r.message} (${r.message})`)
				return r;
			}
			console.log(`[WARNING] ${this.creep.name}: ${r.message}`);
			return r;
		}

		// Stage 2: Transport energy to containers or spawns
		stageName = "Transporting"
		if (this.creep.store.getFreeCapacity() == 0) {
			const r: Status = this.transport();
			if (+r == OK || +r == ERR_BUSY)
				return r;

			if (+r != ERR_NOT_FOUND)
				console.log(`[ERROR] [${this.creep.name}] [${stageName}] ${r.message} (${r.value})`);
			else
				console.log(`[WARN] [${this.creep.name}] [${stageName}] ${r.message} (${r.value})`);

		}
		return new Status(OK);
	}
	private transport() {
		let stageName: string;
		// Stage 1: Tranfer to containers
		stageName = "To Containers";
		let r: Status = this.transferEnergyToContainer();

		if (+r == OK || +r == ERR_BUSY)
			return new Status(OK);

		if (+r != ERR_NOT_FOUND) {
			return new Status(+r, `${stageName} ${r.message}`);
		}

		// Stage 2: Transfer to spawn
		stageName = "To Spawn";
		r = this.transferEnergyToSpawn();

		if (+r == OK)
			return r;

		if (+r != ERR_NOT_FOUND || +r != ERR_BUSY) {
			return new Status(+r, `[${stageName}] ${r.message}`);
		}

		// Stage 3: Waiting for free space
		return r;

	}

}
