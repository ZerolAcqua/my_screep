interface Creep {
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
     * 寻找指定位置附近的储物点，优先级为 Storage > Link > Container
     * @param pos 要搜索的位置
     * @returns 找到的储物点 id
     */
    findStore(pos: RoomPosition): String | null

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
}