interface Creep {

    // 用于保存原始 move，在 creepExtension 里会进行修改
    _move(direction: DirectionConstant | Creep): CreepMoveReturnCode | 
    OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS
    my_move(target: DirectionConstant | Creep):  CreepMoveReturnCode | OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS
    
    /**
     * 远程寻路
     * 
     * @param target 目标位置
     * @param range 搜索范围 默认为 1
     * @returns PathFinder.search 的返回值
     */
    findPath(target: RoomPosition, range: number): string | null
    /**
     * 压缩 PathFinder 返回的路径数组
     * 
     * @param positions 房间位置对象数组，必须连续
     * @returns 压缩好的路径
     */
        serializeFarPath(positions: RoomPosition[]): string
    /**
     * 使用缓存进行移动
     * 该方法会对 creep.memory.farMove 产生影响
     * 
     * @returns ERR_NO_PATH 找不到缓存
     * @returns ERR_INVALID_TARGET 撞墙上了
     */
    goByCache(): CreepMoveReturnCode | ERR_NO_PATH | ERR_NOT_IN_RANGE | ERR_INVALID_TARGET| ERR_INVALID_ARGS
    /**
     * 向指定方向移动
     * 
     * @param target 要移动到的方向
     * @returns ERR_INVALID_TARGET 发生撞停
     */
    // myMove(direction: DirectionConstant): CreepMoveReturnCode
    // myMove(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS

    /**
     * 无视 Creep 的寻路
     * 
     * @param target 要移动到的位置
     */
    goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND

    /**
     * 向指定方向发起对穿
     * 
     * @param direction 要进行对穿的方向
     * @returns OK 成功对穿
     * @returns ERR_BUSY 对方拒绝对穿
     * @returns ERR_NOT_FOUND 前方没有 creep
     */
    mutualCross(direction: DirectionConstant): OK | ERR_BUSY | ERR_NOT_FOUND
    /**
     * 请求对穿
     * 自己内存中 standed 为 true 时将拒绝对穿
     * 
     * @param direction 请求该 creep 进行对穿
     */
    requireCross(direction: DirectionConstant): Boolean

    /**
     * @description 
     * Creep 执行工作
     * @note 感觉这个 work 名称容易产生混淆，此处的 work 函数是指 creep 的执行逻辑开始运行
     */
    work(): void

    /**
     * @description 
     * Creep 工作状态是否应该切换
     * @note 这个 work 是指 creep 是否在工作状态
     */
    shouldWork(): boolean

    /**
     * @description
     * 寻找指定位置附近的 Link
     * @param pos 要搜索的位置
     * @returns 找到的 Link id
     */
    findLink(pos: RoomPosition): string | null

    /**
     * @author HoPGoldy
     * @description
     * 从目标结构获取能量
     * 
     * @param target 提供能量的结构
     * @returns 执行 harvest 或 withdraw 后的返回值
     */
    getEngryFrom(target: Structure | Source): ScreepsReturnCode

    /**
     * @author HoPGoldy
     * @description
     * 转移资源到结构
     * 
     * @param target 要转移到的目标
     * @param RESOURCE 要转移的资源类型
     */
    transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode

    /**
     * @description
     * 寻找指定位置附近的储物点，优先级为 Storage > Link > Container
     * @param pos 要搜索的位置
     * @returns 找到的储物点 id
     * @deprecated
     */
    findStore(pos: RoomPosition): string | null

    /**
     * 采集能量
     * @param number sourcreId 能量源的 id
     * @deprecated
     */
    harvestEnergy(sourcreId: number): void
    /**
     * 采能者采集能量
     * @param number sourcreId 能量源的 id
     * @deprecated
     */
    digEnergy(sourcreId: number): void
    /**
     * 搬运者收集能量到 Storage
     * @deprecated
     */
    gatherEnergy(): void
    /**
     * 收取能量
     * @deprecated
     */
    withdrawEnergy(): void


    /** 
     * 填充所有 spawn 和 extension
     */
    fillSpawnEngery(): boolean
    /** 
     * 填充所有 tower
     */
    fillTower(): boolean
    /** 
     * 填充 storage
     */
    fillStorage(): boolean
    /**
     * 填充 Terminal
     */
    fillTerminal(): boolean

    /** 
     * 建造建筑
     */
    buildStructure(): boolean

    /**
     * 修理 container
     */
    repairContainer(): boolean
    /**
     * 修理 road
     */
    repairRoad(): boolean
    /**
     * 修理 rampart 和 wall
     */
    repairRamptWall(): boolean
}


interface CreepMemory {
    // 内置移动缓存
    _move?: Object


    /**
     * 该 creep 的角色
     */
    role: string

    /**
     * 该 creep 的目标
     */
    target?: string

    /**
     * 该 creep 是否准备就绪
     */
    ready?: boolean

    /**
     * 该 creep 是否在执行任务，针对需要能源进行工作的 creep而言
     */
    working?: boolean

    // 该字段用于减少 creep 向 Room.restrictedPos 里添加自己位置的次数
    standed?: boolean

    // 自己是否会向他人发起对穿
    disableCross?: boolean
    // 上一个位置信息，形如"14/4"，用于在 creep.myMove 返回 OK 时检查有没有撞墙
    prePos?: string
    // 远程寻路缓存
    farMove?: {
        // 序列化之后的路径信息
        path?: string
        // 移动索引，标志 creep 现在走到的第几个位置
        index?: number
        // 上一个位置信息，形如"14/4"，用于在 creep.move 返回 OK 时检查有没有撞墙
        prePos?: string
        // 缓存路径的目标，该目标发生变化时刷新路径, 形如"14/4E14S1"
        targetPos?: string
    }
}