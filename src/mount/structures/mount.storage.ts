// 将拓展签入 Storage 原型
export function mountStorage() {
    _.assign(StructureStorage.prototype, storageExtension)
}


// 自定义的 Storage 的拓展
const storageExtension = {

    /**
     * 运作
     */
    work(): void {
    },

    /**
     * 回调 - 建造完成
     * 分配职责
     */
    onBuildComplete(): void {
        this.room.memory.storageId=this.id
    },
}