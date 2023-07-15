interface RoomMemory {
    /**
     * 房间中央集群核心位置
     */
    center: [number, number]

    /**
     * 房间中央 link id
     */
    centerLinkId?: string

    /**
     * 升级 link id
     */
    upgradeLinkId?: string

    /**
     * Storage id 
     */
    storageId?: string

    /**
     * Storage id 
     */
    terminalId?: string

    /**
     * Observer id
     */
    observerId?: string

    /**
     * Nuker id
     */
    nukerId?: string

    /**
     * PowerSpawn id
     */
    factoryId?: string

    /**
     * PowerSpawn id
     */
    powerSpawnId?: string

    /**
     * 房间的孵化队列
     */
    spawnList: string[]
}

interface Room {
    //  // 已拥有的房间特有，tower 负责维护
    //  _enemys: (Creep|PowerCreep)[]
    //  // 需要维修的建筑，tower 负责维护，为 1 说明建筑均良好
    //  _damagedStructure: AnyStructure | 1
    //  // 该 tick 是否已经有 tower 刷过墙了
    //  _hasFillWall: boolean
    //  // 外矿房间特有，外矿单位维护
    //  // 一旦该字段为 true 就告诉出生点暂时禁止自己重生直到 1500 tick 之后
    //  _hasEnemy: boolean
    //  // 焦点墙，维修单位总是倾向于优先修复该墙体
    //  _importantWall: StructureWall | StructureRampart
    //  // 该房间是否已经执行过 lab 集群作业了
    //  // 在 Lab.work 中调用，一个房间只会执行一次
    //  _hasRunLab: boolean
    //  // 该房间是否已经运行过工地作业了
    //  _hasRunConstructionSite: boolean
 
     // 房间基础服务
     factory?: StructureFactory
     powerSpawn: StructurePowerSpawn
     nuker: StructureNuker
     observer: StructureObserver
     centerLink: StructureLink
     extractor: StructureExtractor
     mineral: Mineral
     sources: Source[]
     sourceContainers: StructureContainer[]
     _factory: StructureFactory
     _mineral: Mineral
     _powerspawn: StructurePowerSpawn
     _nuker: StructureNuker
     _sources: Source[]
     _centerLink: StructureLink
     _observer: StructureObserver
     _extractor: StructureExtractor
     _sourceContainers: StructureContainer[]

    /**
     * 设置房间中央集群核心位置
     */
    setCoreCenter(center: RoomPosition): void

    /**
     * 房间运作
     */
    work(): void

    /**
     * TODO: 未完成
     * 房间孵化
     * @param creepName 要孵化的 creep 名称
     */
    addSpawnTask(creepName: string): number | ERR_NAME_EXISTS

    /**
     * 检查生产队列中是否包含指定任务
     * 
     * @param taskName 要检查的任务名
     * @returns true/false 有/没有
     */
    hasSpawnTask(taskName: string): boolean

    /**
     * 房间防御
     */
    defendEnemy(): boolean

    /**
     * 房间修理
     */
    repairBuilding(): boolean

}



