interface RoomMemory {
    /**
     * 房间中央集群核心位置
     */
    center: [number, number]
}

interface Room {


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
    addSpawnTask(creepName: string): void

    /**
     * 房间防御
     */
    defendEnemy(): boolean

    /**
     * 房间修理
     */
    repairBuilding(): boolean

}
