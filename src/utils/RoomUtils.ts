function getNotEmptyContainers(room: Room) {
  const containers = <StructureContainer[]>room.find(FIND_STRUCTURES, {
    filter: (struct: Structure): Boolean =>
      struct.structureType == STRUCTURE_CONTAINER
  });

  containers.sort((a, b) => a.store.getUsedCapacity() - b.store.getUsedCapacity());
  return containers;
}

export {
  getNotEmptyContainers
}
