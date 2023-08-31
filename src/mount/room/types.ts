interface RoomMemory {


    /**
     * 房间中央集群核心位置
     */
    center: [number, number]

    // 房间关键建筑 id
    centerLinkId?: string
    upgradeLinkId?: string
    storageId?: string
    terminalId?: string
    observerId?: string
    nukerId?: string
    factoryId?: string
    powerSpawnId?: string

    // 当前被 repairer 或 tower 关注的墙
    focusWall: {
        id: string
        endTime: number
    }

    // 当前房间所处的防御模式
    // defense 为基础防御，active 为主动防御，该值未定义时为日常模式
    defenseMode?: 'defense' | 'active'

    
    // 房间的孵化队列
    spawnList: string[]

    // 房间物流任务队列
    transferTasks: RoomTransferTasks[]

    // 该房间禁止通行点的存储
    // 键为注册禁止通行点位的 creep 名称，值为禁止通行点位 RoomPosition 对象的序列字符串
    restrictedPos?: {
        [creepName: string]: string
    }

    // 由驻守在房间中的 pc 发布，包含了 pc 拥有对应的能力
    // 形如: "1 3 13 14"，数字即为对应的 PWR_* 常量
    powers?: string
    // powerSpawn 是否暂停
    pausePS?: boolean
    // power 任务请求队列
    // 由建筑物发布，powerCreep 查找任务时会优先读取该队列
    powerTasks: PowerConstant[]

    // // 建筑工的当前工地目标，用于保证多个建筑工的工作统一以及建筑工死后不会寻找新的工地
    // constructionSiteId: string
    // // 建筑工特有，当前正在修建的建筑类型，用于在修建完成后触发对应的事件
    // constructionSiteType?: StructureConstant
    // // 建筑工地的坐标，用于在建造完成后进行 lookFor 来确认其是否成功修建了建筑
    // constructionSitePos: number[]

    // 工厂内存
    factory: {
        // 当前房间的等级，由用户指定
        level?: 1 | 2 | 3 | 4 | 5
        // 下个顶级产物索引
        targetIndex: number
        // 本工厂参与的生产线类型
        depositTypes?: DepositConstant[]
        // 当该字段为真并且工厂在冷却时，就会执行一次底物是否充足的检查，执行完就会直接将该值移除
        produceCheck?: boolean
        // 当前工厂所处的阶段
        state: string
        // 工厂生产队列
        taskList: IFactoryTask[]
        // 工厂是否即将移除
        // 在该字段存在时，工厂会搬出所有材料，并在净空后移除 room.factory 内存
        // 在净空前手动删除该字段可以终止移除进程
        remove?: true
        // 工厂是否暂停，该属性优先级高于 sleep，也就是说 sleep 结束的时候如果有 pause，则工厂依旧不会工作
        pause?: true
        // 工厂休眠时间，如果该时间存在的话则工厂将会待机
        sleep?: number
        // 休眠的原因
        sleepReason?: string
        // 玩家手动指定的目标，工厂将一直合成该目标
        specialTraget?: CommodityConstant
    }
}

interface Room {

    // 已拥有的房间特有，tower 负责维护
    _enemys: (Creep|PowerCreep)[]
    // 需要维修的建筑，tower 负责维护，为 1 说明建筑均良好
    _damagedStructure: AnyStructure | 1
    // 该 tick 是否已经有 tower 刷过墙了
    _hasFillWall: boolean
    // 外矿房间特有，外矿单位维护
    // 一旦该字段为 true 就告诉出生点暂时禁止自己重生直到 1500 tick 之后
    _hasEnemy: boolean
    // 焦点墙，维修单位总是倾向于优先修复该墙体
    _importantWall: StructureWall | StructureRampart
    // 该房间是否已经执行过 lab 集群作业了
    // 在 Lab.work 中调用，一个房间只会执行一次
    _hasRunLab: boolean
    // 该房间是否已经运行过工地作业了
    _hasRunConstructionSite: boolean


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
     * @author HoPGoldy
     * @abstract 全局日志
     * 
     * @param content 日志内容
     * @param prefixes 前缀中包含的内容
     * @param color 日志前缀颜色
     * @param notify 是否发送邮件
     */
    log(content: string, instanceName?: string, color?: Colors | undefined, notify?: boolean): void

    /**
     * 设置房间中央集群核心位置
     */
    setCoreCenter(center: RoomPosition): void


    /**
     * 添加禁止通行位置
     * 
     * @param creepName 禁止通行点位的注册者
     * @param pos 禁止通行的位置
     */
    addRestrictedPos(creepName: string, pos: RoomPosition): void

    /**
     * 获取房间内的禁止通行点位
     */
    getRestrictedPos(): { [creepName: string]: string }

    /**
     * 将指定位置从禁止通行点位中移除
     * 
     * @param creepName 要是否点位的注册者名称
     */
    removeRestrictedPos(creepName: string): void

    /**
     * 将指定位置序列化为字符串
     * 形如: 12/32/E1N2
     * 
     * @param pos 要进行压缩的位置
     */
    serializePos(pos: RoomPosition): string 
    
    /**
     * 将位置序列化字符串转换为位置
     * 位置序列化字符串形如: 12/32/E1N2
     * 
     * @param posStr 要进行转换的字符串
     */
    unserializePos(posStr: string): RoomPosition | undefined

    /**
     * 房间运作
     */
    work(): void

    // 房间 pc 孵化 api
    addPowerTask(task: PowerConstant, priority: number): OK | ERR_NAME_EXISTS | ERR_INVALID_TARGET
    getPowerTask(): PowerConstant | undefined
    hangPowerTask(): void
    deleteCurrentPowerTask(): void
    addSpawnTask(creepName: string): number | ERR_NAME_EXISTS

    // 房间 creep 孵化 api
    hasSpawnTask(taskName: string): boolean
    hangSpawnTask(): void 

    // 房间物流 api
    addRoomTransferTask(task: RoomTransferTasks, priority?: number): number
    hasRoomTransferTask(taskType: string): boolean
    getRoomTransferTask(): RoomTransferTasks | null
    handleLabInTask(resourceType: ResourceConstant, amount: number): boolean
    deleteCurrentRoomTransferTask(): void


    /**
     * 房间防御
     */
    defendEnemy(): boolean

    /**
     * 房间修理
     */
    repairBuilding(): boolean

}



