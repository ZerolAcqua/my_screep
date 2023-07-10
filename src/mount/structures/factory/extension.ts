/**
 * @description
 * 自定义的 Terminal 的拓展
 */
export default class FactoryExtension extends StructureFactory {  
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
        this.room.memory.factoryId=this.id
    }
}
