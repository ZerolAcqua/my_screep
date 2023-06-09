interface Creep {
    /**
    * Creep 执行工作
    */
    work(): void

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
     * 该 creep 是否准备就绪
     */
    ready?: boolean

    /**
     * 该 creep 是否执行任务
     */
    working?: boolean
}