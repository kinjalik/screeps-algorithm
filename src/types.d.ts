// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
	role: string;
	// For builder
	building?: boolean;
	// For upgrader
	upgrading?: boolean;
}

interface Memory {
	uuid: number;
	log: any;
	counters: any;
}


// `global` extension samples
declare namespace NodeJS {
	interface Global {
		log: any;
		WORK: WORK;
		MOVE: MOVE;
		CARRY: CARRY;


	}
}
