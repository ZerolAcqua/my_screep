/** 采集者角色
*   用于初始启动的角色
*   @deprecated
*/
const roleHarvester: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        if (creep.shouldWork()) {
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
 * 采能者角色：采集能源
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
            creep.goTo(pos)
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
        const source = Game.getObjectById(data.sourceId) as Source
        creep.getEngryFrom(source)

    },
    /**
     * 该 creep 需要重生
     */
};


/** 
 * @description 
 * 收集者角色：采集能源
 * @finish
 */
const roleCollector: FuncDict = {

    /** 
     * @FIXME: 需要修改就位的逻辑，以后干脆放到配置里
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {

        const config = Memory.creepConfigs[creep.name]
        const data = config.data as WorkerData
        const source = Game.getObjectById(data.sourceId) as Source

        // const pos = source.pos.findInRange(FIND_STRUCTURES, 1,
        //     { filter: { structureType: STRUCTURE_CONTAINER } })[0].pos;
        const pos_structure = source.pos.findInRange(FIND_STRUCTURES, 1,
            { filter: { structureType: STRUCTURE_RAMPART } })[0]
        let pos = source.pos
        if (!creep.memory.targetId) creep.memory.targetId = creep.findLink(pos)
        if (pos_structure) {
            pos = pos_structure.pos
            creep.goTo(pos)
            creep.memory.ready = (creep.pos.x == pos.x && creep.pos.y == pos.y)
        }
        else {
            creep.goTo(pos, 1)
            creep.memory.ready = (creep.getEngryFrom(source) == 0)
        }
    },

    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        const config = Memory.creepConfigs[creep.name]
        const data = config.data as WorkerData
        const source = Game.getObjectById(data.sourceId) as Source
        if (creep.memory.targetId == null) {
            creep.getEngryFrom(source)
        }
        else {
            if (creep.shouldWork()) {
                creep.transferTo(Game.getObjectById(creep.memory.targetId) as Structure, RESOURCE_ENERGY)

            }
            else {
                creep.getEngryFrom(source)
            }
        }
    },
    /**
     * 该 creep 需要重生
     */
};


/** 
 * @description 
 * 搬运者角色，目前只考虑从 container 搬运能量
 * @todo
 * @deprecated
 */
const roleCarrier: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep) {
        if (creep.shouldWork()) {
            creep.fillSpawnEngery() || creep.fillTower() || creep.fillStorage() || creep.fillTerminal()
        }
        else {
            const config = Memory.creepConfigs[creep.name]
            const data = config.data as CarrierData
            const source = Game.getObjectById(data.sourceId) as StructureStore

            if (!creep.pos.inRangeTo(source.pos, 1)) {
                creep.goTo(source.pos)
                return
            }
            creep.getEngryFrom(source)
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
        creep.goTo(creep.room.getPositionAt(32, 22))
        creep.memory.ready = (creep.pos.x == 32 && creep.pos.y == 22)
        creep.memory.working = false
    },

    /** @param {Creep} creep **/
    run: function (creep: Creep) {
        if (creep.shouldWork()) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // creep.goTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.goTo(creep.room.getPositionAt(32, 22));
            }
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.goTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
            // creep.withdrawEnergy()
            // creep.harvestEnergy(1)
            creep.getEngryFrom(Game.getObjectById(creep.room.memory['upgradeLinkId']) as Structure)
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


        if (creep.shouldWork()) {
            if (creep.buildStructure() == false) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < 2000 && structure.structureType == STRUCTURE_RAMPART);
                    }
                });
                if (targets.length) {
                    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.goTo(targets[0].pos);
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
            const source = Game.getObjectById<Structure>(creep.room.memory['storageId'])
            if (!creep.pos.inRangeTo(source.pos, 1)) {
                creep.goTo(source.pos)
                return
            }
            creep.getEngryFrom(source)
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
        if (creep.shouldWork()) {

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
            //         creep.goTo(targets[0], { visualizePathStyle: { stroke: '#ff0000' } });
            //     }
            // }

            creep.repairRamptWall()
        }
        else {
            // var sources = creep.room.find(FIND_SOURCES);
            // if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            //     creep.goTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            // }
            creep.getEngryFrom(Game.getObjectById<Structure>(creep.room.memory['storageId']))
        }
    },
    /**
     * 该 creep 需要重生
     */
};


export const basicRoles: { [key: string]: FuncDict } = {
    "harvester": roleHarvester,
    "digger": roleDigger,
    "collector": roleCollector,
    "carrier": roleCarrier,
    "upgrader": roleUpgrader,
    "builder": roleBuilder,
    "repairer": roleRepairer
}
