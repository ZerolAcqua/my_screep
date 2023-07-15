/** 中央处理者角色
*   用于中央集群处理的角色
*/
const roleProcessor: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {
        const center = creep.room.memory.center
        creep.moveTo(...center)
        creep.memory.ready = (creep.pos.x == center[0] && creep.pos.y == center[1])
    },

    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep): void {
        if (creep.shouldWork()) {
            creep.transferTo(Game.getObjectById<Structure>(creep.room.memory['storageId']), RESOURCE_ENERGY) == OK
                || creep.transferTo(Game.getObjectById<Structure>(creep.room.memory['NukerId']), RESOURCE_ENERGY) == OK
                || creep.transferTo(Game.getObjectById<Structure>(creep.room.memory['terminalId']), RESOURCE_ENERGY) == OK
        }
        else {
            creep.getEngryFrom(Game.getObjectById<Structure>(creep.room.memory['centerLinkId']))
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

