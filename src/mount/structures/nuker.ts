/**
 * @description
 * 自定义的 Nuker 的拓展
 */
export class NukerExtension extends StructureNuker {
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
        this.room.memory.nukerId = this.id
    }
}
