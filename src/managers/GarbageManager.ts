function collectGarbage(): void {
	for (const name in Memory.creeps)
		if (!(name in Game.creeps))
			delete Memory.creeps[name];
}

export {
	collectGarbage
}
