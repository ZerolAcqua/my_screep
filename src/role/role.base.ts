/** 采集者角色
*   用于初始启动的角色
*/
export const roleHarvester = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('carrying');
        }
       
        if (creep.memory.working==true) {
            creep.fillSpawnEngery()

        }
        else {
            creep.harvestEnergy(0)
        }
    }
};

/** 采能者角色
*   无脑采集能源
*/
export const roleDigger = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        creep.digEnergy(0)
    }
};

/** 搬运者角色
*/
export const roleCarrier = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('fetching');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('carrying');
        }


        if (creep.memory.working==true) {
            creep.fillSpawnEngery()||creep.fillTower()
        }
        else {
            creep.withdrawEnergy()
        }
    }
};

/**
 * 升级者角色
 */
export const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep: Creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('upgrade');
        }


        if (creep.memory.working) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                // creep.moveTo(creep.room.getPositionAt(32, 22), { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
            // creep.withdrawEnergy()
            creep.harvestEnergy(1)
        }
    }
};


/** 建造者角色
* 
*/
export const roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep: Creep, resourceId = 1) {

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('build');
        }

        if (creep.memory.working) {
            if(creep.buildStructure()==false){
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < 2000 && structure.structureType == STRUCTURE_RAMPART);
                    }
                });
                if (targets.length) {
                    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                }
            }
        }

        else {
            creep.harvestEnergy(1);
            // creep.withdrawEnergy()
        }
    }
};

/**
 * 修理者角色
 */

export const roleRepairer = {
    /** @param {Creep} creep **/
    run: function (creep: Creep) {

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('repair');
        }

        if (creep.memory.working) {

            // 修理 container
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER;
                }
            });


            // 修理 road
            if (!targets.length) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_ROAD;
                    }
                });
            }

            // 修理 rampart
            if (!targets.length) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < 0.1
                            * structure.hitsMax && structure.structureType == STRUCTURE_RAMPART);
                    }
                });
            }

            // 修理 wall
            if(!targets.length)
            {
                targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits<0.0005*structure.hitsMax &&  structure.structureType == STRUCTURE_WALL;
                    }
                });
            }

            if (targets.length) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
            creep.withdrawEnergy()
        }
    }
};
