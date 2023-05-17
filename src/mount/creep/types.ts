interface Creep {
    /**
    * Creep 执行工作
    */
    work(): void 

    /**
     * 采集能量
     * @param number sourcreId 能量源的 id
     */
    harvestEnergy(sourcreId: number): void
    /**
     * 采能者采集能量
     * @param number sourcreId 能量源的 id
     */
    digEnergy(sourcreId: number): void
    /**
     * 搬运者收集能量到 Storage
     */
    gatherEnergy(): void
    /**
     * 收取能量
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
