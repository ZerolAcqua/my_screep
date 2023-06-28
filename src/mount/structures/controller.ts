/**
 * @author HoPGoldy
 * @abstract Controller 拓展
 * @description 
 * 统计当前升级进度
 */
export class ControllerExtension extends StructureController {
    public work(): void {
        if (Game.time % 20) return

        // 如果等级发生变化了就运行 creep 规划
        if (this.stateScanner()) this.onLevelChange(this.level)
    }

    /**
     * @description 当等级发生变化时的回调函数
     * 
     * @param level 当前的等级
     */
    public onLevelChange(level: number): void {
    }

    /**
     * @description 统计自己的等级信息
     * 
     * @returns 为 true 时说明自己等级发生了变化
     */
    private stateScanner(): boolean {
        let hasLevelChange = false
        if (!Memory.stats.rooms[this.room.name]) Memory.stats.rooms[this.room.name] = {}

        // 统计升级进度
        Memory.stats.rooms[this.room.name].controllerRatio = (this.progress / this.progressTotal) * 100

        // 统计房间等级
        if (Memory.stats.rooms[this.room.name].controllerLevel !== this.level) hasLevelChange = true
        Memory.stats.rooms[this.room.name].controllerLevel = this.level

        return hasLevelChange
    }
}