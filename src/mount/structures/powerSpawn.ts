import { createHelp } from 'modules/help'
import { colorful } from "@/utils"

/**
 * @description
 * 自定义的 powerSpawn 的拓展
 */
export class PowerSpawnExtension extends StructurePowerSpawn {
    /**
     * @description 运作
     */
    public work(): void {
        // ps 未启用或者被暂停了就跳过
        if (this.room.memory.pausePS) return

        // 处理 power
        this.processPower()
    }

    /**
     * @description 回调 - 建造完成
     * 分配职责
     */
    public onBuildComplete(): void {
        this.room.memory.powerSpawnId = this.id
    }

    /**
     * 用户操作 - 启动 powerSpawn
     */
      public on(): string {
        delete this.room.memory.pausePS

        // 把自己注册到全局的启用 ps 列表
        if (!Memory.psRooms) Memory.psRooms = []
        Memory.psRooms = _.uniq([ ...Memory.psRooms, this.room.name])

        return `[${this.room.name} PowerSpawn] 已启动 process power`
    }

    /**
     * 用户操作 - 关闭 powerSpawn
     */
    public off(): string {
        this.room.memory.pausePS = true
        
        // 把自己从全局启用 ps 列表中移除
        if (Memory.psRooms) {
            Memory.psRooms = _.difference(Memory.psRooms, [ this.room.name ])
            if (Memory.psRooms.length <= 0) delete Memory.psRooms
        }

        return `[${this.room.name} PowerSpawn] 已暂停 process power`
    }

    /**
     * 用户操作 - 查看 ps 运行状态
     */
    public stats(): string {
        let roomsStats: string[] = []
        // 生成状态
        const working = this.store[RESOURCE_POWER] > 1 && this.store[RESOURCE_ENERGY] > 50
        const stats = working ? colorful('工作中', 'green') : colorful('等待资源中', 'red')
        // 统计 powerSpawn、storage、terminal 的状态
        roomsStats.push(`[${this.room.name}] ${stats} POWER: ${this.store[RESOURCE_POWER]}/${POWER_SPAWN_POWER_CAPACITY} ENERGY: ${this.store[RESOURCE_ENERGY]}/${POWER_SPAWN_ENERGY_CAPACITY}`)
        roomsStats.push(this.room.storage ? `Storage energy: ${this.room.storage.store[RESOURCE_ENERGY]}` : `Storage X`)
        roomsStats.push(this.room.terminal ? `Terminal power: ${this.room.terminal.store[RESOURCE_POWER]}` : `Terminal X`)

        return roomsStats.join(' || ')
    }

    /**
     * 用户操作 - 帮助信息
     */
    public help(): string {
        return createHelp({
            name: 'PowerSpawn 控制台',
            describe: `ps 默认不启用，执行 ${colorful('.on', 'yellow')}() 方法会启用 ps。启用之后会进行 power 自动平衡。`,
            api: [
                {
                    title: '启动/恢复处理 power',
                    functionName: 'on'
                },
                {
                    title: '暂停处理 power',
                    functionName: 'off'
                },
                {
                    title: '查看当前状态',
                    functionName: 'stats'
                }
            ]
        })
    }
}
