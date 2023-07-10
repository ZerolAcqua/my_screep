/**
 * @description
 * 自定义的 powerSpawn 的拓展
 */
export class PowerSpawnExtension extends StructurePowerSpawn {
    /**
     * @description 运作
     */
    public work(): void {

    }

    /**
     * @description 回调 - 建造完成
     * 分配职责
     */
    public onBuildComplete(): void {
        this.room.memory.powerSpawnId = this.id
    }
}
