/** 中央处理者角色
*   用于中央集群处理的角色
*/
const roleProcessor: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {
        const center = creep.room.memory.center
        creep.goTo(creep.room.getPositionAt(...center))
        creep.memory.ready = (creep.pos.x == center[0] && creep.pos.y == center[1])
    },

    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep): void {
        // TODO: 这样的逻辑肯定是不行的，需要改
        if (Game.time % 40 < 5) {
            if (creep.store.getUsedCapacity() != 0) {
                // energy
                creep.transferTo(creep.room.powerSpawn, RESOURCE_ENERGY) == OK
                    || (creep.room.storage.store.getFreeCapacity() > 0.3 * creep.room.storage.store.getCapacity() 
                    && creep.transferTo(creep.room.storage, RESOURCE_ENERGY) == OK)
                    || creep.transferTo(creep.room.nuker, RESOURCE_ENERGY) == OK
                    || creep.transferTo(creep.room.terminal, RESOURCE_ENERGY) == OK
                    // Ghodium
                    || creep.transferTo(creep.room.nuker, RESOURCE_GHODIUM) == OK
                    || creep.transferTo(creep.room.storage, RESOURCE_GHODIUM) == OK
                    // Power
                    || creep.transferTo(creep.room.powerSpawn, RESOURCE_POWER) == OK
                    || creep.transferTo(creep.room.storage, RESOURCE_POWER) == OK

            }
            else {
                // energy
                // creep.getEngryFrom(creep.room.centerLink) == OK
                // || creep.getEngryFrom(creep.room.storage) == OK
                // Ghodium
                creep.withdraw(creep.room.terminal, RESOURCE_GHODIUM) == OK
                    // Power
                    || creep.withdraw(creep.room.terminal, RESOURCE_POWER) == OK
                    || creep.withdraw(creep.room.storage, RESOURCE_POWER) == OK
            }
        }
        else {
            if (creep.store.getUsedCapacity() != 0) {
                // energy
                creep.transferTo(creep.room.powerSpawn, RESOURCE_ENERGY) == OK
                    || (creep.room.storage.store.getFreeCapacity() > 0.2 * creep.room.storage.store.getCapacity() 
                    && creep.transferTo(creep.room.storage, RESOURCE_ENERGY) == OK)
                    || creep.transferTo(creep.room.nuker, RESOURCE_ENERGY) == OK
                    || creep.transferTo(creep.room.terminal, RESOURCE_ENERGY) == OK
                    // Ghodium
                    || creep.transferTo(creep.room.nuker, RESOURCE_GHODIUM) == OK
                    || creep.transferTo(creep.room.storage, RESOURCE_GHODIUM) == OK
                    // Power
                    || creep.transferTo(creep.room.storage, RESOURCE_POWER) == OK

            }
            else {
                // energy
                creep.getEngryFrom(creep.room.centerLink) == OK
                    || creep.getEngryFrom(creep.room.storage) == OK
                    // Ghodium
                    || creep.withdraw(creep.room.terminal, RESOURCE_GHODIUM) == OK
                    // Power
                    || creep.withdraw(creep.room.terminal, RESOURCE_POWER) == OK
                    || creep.withdraw(creep.room.storage, RESOURCE_POWER) == OK
            }
        }
    },
    /**
     * 该 creep 需要重生
     */
};

/** 资源分配者角色
*   用于从中央集群填充资源的角色
*/
const roleDistributor: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep): void {
        if (creep.shouldWork()) {
            // TODO: 按规划路径分配资源
            creep.fillSpawnEngery() || creep.fillTower()
        }
        else {
            const source = Game.getObjectById<StructureStore>(creep.room.memory['storageId'])
            creep.getEngryFrom(source)
        }
    }
    /**
     * 该 creep 需要重生
     */
};


export const advancedRoles: { [key: string]: FuncDict } = {
    "processor": roleProcessor,
    "distributor": roleDistributor,
}

