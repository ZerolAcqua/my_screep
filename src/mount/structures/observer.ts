/**
 * @description
 * 自定义的 Observer 的拓展
 */
export class ObserverExtension extends StructureObserver {
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
        this.room.memory.observerId = this.id
    }
}
