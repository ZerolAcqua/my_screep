/**
 * @description
 * 自定义的 Storage 的拓展
 */
export class StorageExtension extends StructureStorage {  
    /**
     * @description 运作
     */
    public work(): void {
        this.stateScanner()
    }

    /**
     * @description 回调 - 建造完成
     * 分配职责
     */
    public onBuildComplete(): void {
        this.room.memory.storageId=this.id
    }

    /**
     * @description 统计自己存储中的剩余能量
     */
        private stateScanner(): void {
            if (Game.time % 20) return
            if (!Memory.stats.rooms[this.room.name]) Memory.stats.rooms[this.room.name] = {}
            Memory.stats.rooms[this.room.name].energy = this.store[RESOURCE_ENERGY]
        }
}



