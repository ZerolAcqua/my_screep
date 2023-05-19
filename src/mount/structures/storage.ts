/**
 * @description
 * 自定义的 Storage 的拓展
 */
export class StorageExtension extends StructureStorage {  
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
        this.room.memory.storageId=this.id
    }
}



