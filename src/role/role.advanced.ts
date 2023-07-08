/** 中央处理者角色
*   用于中央集群处理的角色
*/
const roleProcessor: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep): void {
        if (creep.shouldWork()) {
            creep.transfer(Game.getObjectById(creep.room.memory['centerLinkId']) as Structure, RESOURCE_ENERGY)
        }
        else {
            const sources = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE;
                }
            }
            )
            creep.withdraw(sources[0], RESOURCE_ENERGY)
        }
    },
    /** 
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {
        const center = creep.room.memory.center
        if (creep.pos.x != center[0] || creep.pos.y != center[1]) {
            creep.moveTo(center[0], center[1])
        }
        else {
            creep.memory.ready = true
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
        }
        else {
            // TODO: 从中央集群的 Storage 获取资源
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

