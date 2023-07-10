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
