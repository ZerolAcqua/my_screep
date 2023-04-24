export const towerRepair = {
    run: function (room) {

        var towers = room.find(
            FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        // 1.rampart
        var targets = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < 0.01
                    * structure.hitsMax && structure.structureType == STRUCTURE_RAMPART);
            }
        });
        // 2.container
        if (!targets.length) {
            targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER;
                }
            });
        }
        // 3.wall
        if (!targets.length) {
            targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 0.0005 * structure.hitsMax && structure.structureType == STRUCTURE_WALL;
                }
            });
        }

        for (let i = 0; i < towers.length; i++) {
            if (towers[i].store.getFreeCapacity(RESOURCE_ENERGY) < 0.5 * towers[i].store.getCapacity(RESOURCE_ENERGY)) {
                towers[i].repair(targets[0]);
                console.log("OK");
            }
        }
    }
}
