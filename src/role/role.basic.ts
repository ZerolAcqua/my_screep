/** 采集者角色
*   用于初始启动的角色
*/
const roleHarvester: FuncDict = {
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

        if (creep.memory.working == true) {
            creep.fillSpawnEngery()

        }
        else {
            creep.harvestEnergy(0)
        }
    },
    /**
     * 该 creep 是否需要重生
     */
    isNeed(room: Room, name: string, creepMemory: CreepMemory) {
        if (Object.keys(Game.creeps).length > 2) return false
        else return true
    }
};

/** 
 * @description 
 * 采能者角色：无脑采集能源
 * @finish
 */
const roleDigger: FuncDict = {

    /** 
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {

        const config = Memory.creepConfigs[creep.name]
        const data = config.data as WorkerData
        const source = Game.getObjectById(data.sourceId) as Source | Mineral

        const pos = source.pos.findInRange(FIND_STRUCTURES, 1,
            { filter: { structureType: STRUCTURE_CONTAINER } })[0].pos;


        if (creep.pos.x != pos.x || creep.pos.y != pos.y) {
            creep.moveTo(pos)
        }
        else {
            creep.memory.ready = true
        }
    },

    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        const config = Memory.creepConfigs[creep.name]
        const data = config.data as WorkerData
        const source = Game.getObjectById(data.sourceId) as Source | Mineral
        creep.harvest(source)
    },
    /**
     * 该 creep 需要重生
     */
};

/** 
 * @description 
 * 搬运者角色，目前只考虑搬运，不考虑采集
 * @todo
 * 
 * 
 * 
*/
const roleCarrier: FuncDict = {
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


        if (creep.memory.working == true) {
            creep.fillSpawnEngery() || creep.fillTower() || creep.fillStorage() || creep.fillTerminal()
        }
        else {
            const config = Memory.creepConfigs[creep.name]
            const data = config.data as CarrierData
            const source = Game.getObjectById(data.sourceId) as StructureStore

            if (!creep.pos.inRangeTo(source.pos, 1)) {
                creep.moveTo(source)
                return
            }

            const sourceTypes = Object.keys(source.store)
            creep.withdraw(source, sourceTypes[0] as ResourceConstant)
        }
    },
    /**
     * 该 creep 需要重生
     */
};

/**
 * @description 
 * 升级者角色
 */
const roleUpgrader: FuncDict = {

    /** 
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {
        // 这里的逻辑要更改，不能直接写死坐标
        if (creep.pos.x != 32 || creep.pos.y != 22) {
            creep.moveTo(32, 22)
        }
        else {
            creep.memory.ready = true
        }

    },

    /** @param {Creep} creep **/
    run: function (creep: Creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say('upgrade');
        }


        if (creep.memory.working) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.moveTo(creep.room.getPositionAt(32, 22), { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
            // creep.withdrawEnergy()
            // creep.harvestEnergy(1)
            creep.withdraw(Game.getObjectById(creep.room.memory['upgradeLinkId']) as Structure, RESOURCE_ENERGY)
        }
    },
    /**
     * 该 creep 需要重生
     */


};


/** 
 * @description
 * 建造者角色
 * 
 */
const roleBuilder: FuncDict = {
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
            if (creep.buildStructure() == false) {
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
                else {
                    creep.repairRamptWall()
                }
            }
        }

        else {
            // creep.harvestEnergy(1);
            // creep.withdrawEnergy()
            const source = Game.getObjectById(creep.room.memory['storageId']) as Structure
            if (!creep.pos.inRangeTo(source.pos, 1)) {
                creep.moveTo(source)
                return
            }
            creep.withdraw(source, RESOURCE_ENERGY)
        }
    },
    /**
     * 该 creep 是否需要重生
     */
    isNeed(room: Room, name: string, creepMemory: CreepMemory) {
        return room.find(FIND_CONSTRUCTION_SITES).length > 0
    }
};

/**
 * @description
 * 修理者角色
 * @danger 还未适配新的 creepConfig
 */

const roleRepairer: FuncDict = {
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

            // // 修理 container
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER;
            //     }
            // });


            // // 修理 road
            // if (!targets.length) {
            //     targets = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_ROAD;
            //         }
            //     });
            // }

            // // 修理 rampart
            // if (!targets.length) {
            //     targets = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return (structure.hits < 0.1
            //                 * structure.hitsMax && structure.structureType == STRUCTURE_RAMPART);
            //         }
            //     });
            // }

            // // 修理 wall
            // if(!targets.length)
            // {
            //     targets = creep.room.find(FIND_STRUCTURES, {
            //             filter: (structure) => {
            //                 return structure.hits<0.0005*structure.hitsMax &&  structure.structureType == STRUCTURE_WALL;
            //         }
            //     });
            // }

            // if (targets.length) {
            //     if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
            //     }
            // }

            creep.repairRamptWall()
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
            creep.withdrawEnergy()
        }
    },
    /**
     * 该 creep 需要重生
     */
};


export const basicRoles: { [key: string]: FuncDict } = {
    "harvester": roleHarvester,
    "digger": roleDigger,
    "carrier": roleCarrier,
    "upgrader": roleUpgrader,
    "builder": roleBuilder,
    "repairer": roleRepairer
}
