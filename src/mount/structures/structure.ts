/**
 * @description
 * 自定义的 Structure 基类的拓展
 */
export class StructureExtension extends Structure {
    /**
     * 运作
     */
    public work(): void {
    }

    /**
     * 回调 - 建造完成
     * 分配职责
     */
    public onBuildComplete(): void {
    }

    // 建筑通用的日志方法
    log(content:string, color: Colors | undefined = undefined, notify: boolean = false): void {
        this.room.log(content, this.structureType, color, notify)
    }
}