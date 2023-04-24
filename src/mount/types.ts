interface Creep {
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
     * 建造建筑
     */
    buildStructure(): boolean

}
