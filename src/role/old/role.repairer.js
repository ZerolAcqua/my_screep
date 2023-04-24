import { roleBuilder } from './role.builder'

export const roleRepairer = {


    run: function (creep) {

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('repair');
        }

        if (creep.memory.repairing) {

            // 修理 container
            var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits<0.9*structure.hitsMax &&  structure.structureType == STRUCTURE_CONTAINER;
                    }
                });

            // 修理 rampart
            if (!targets.length) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits<0.01
                        *structure.hitsMax &&  structure.structureType == STRUCTURE_RAMPART);
                    }
                });
            }

            // 修理 road
            if (!targets.length) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_ROAD;
                    }
                });
            }


            if (!targets.length) {
                roleBuilder.run(creep);
            }
            else {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};
