import { ErrorController } from "managers/ErrorManager";
import { collectGarbage } from "managers/GarbageManager";
import { CreepMiner } from "controllers/creeps/CreepMiner";
import { CreepUpgrader } from "controllers/creeps/CreepUpgrader";
import { renewCreeps, assignRoles } from "managers/CreepManager";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorController.wrapLoop(() => {
	console.log(`Current game tick is ${Game.time}`);

	// Automatically delete memory of missing creeps
	collectGarbage();

	renewCreeps();
	assignRoles();

});
