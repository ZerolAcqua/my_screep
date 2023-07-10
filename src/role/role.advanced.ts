/** 中央处理者角色
*   用于中央集群处理的角色
*/
const roleProcessor: FuncDict = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep): void {
        if (creep.shouldWork()) {
            creep.transfer(Game.getObjectById(creep.room.memory['storageId']) as Structure, RESOURCE_ENERGY)
        }
        else {
            creep.withdraw(Game.getObjectById(creep.room.memory['centerLinkId']) as Structure, RESOURCE_ENERGY)
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
            creep.fillSpawnEngery() || creep.fillTower()
        }
        else {

            // TODO: 提取为一个 moveWithdraw 函数
            const source = Game.getObjectById(creep.room.memory['storageId']) as StructureStore
            if (!creep.pos.inRangeTo(source.pos, 1)) {
                creep.moveTo(source)
                return
            }
            const sourceTypes = Object.keys(source.store)
            creep.withdraw(source, sourceTypes[0] as ResourceConstant)
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

