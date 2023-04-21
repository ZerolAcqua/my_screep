interface Creep {
    /**
     * 采集能量
     */
    harvestEnergy(sourcreId: number): void
    /** 
     * 填充所有 spawn 和 extension
     */
    fillSpawnEngery(): boolean
    /** 
     * 建造建筑
     */
    buildStructure(): boolean

}

interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string
    building: boolean
}