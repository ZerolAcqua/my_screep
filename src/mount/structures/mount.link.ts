// 将拓展签入 Link 原型
export function mountLink() {
    _.assign(StructureLink.prototype, linkExtension)
}


// 自定义的 Room 的拓展
const linkExtension = {

    /**
     * 运作
     */
    work(): void {
        // 冷却好了再执行
        if (this.cooldown != 0) return

        // 检查内存字段来决定要执行哪种职责的工作
        if (this.room.memory.centerLinkId && this.room.memory.centerLinkId === this.id) this.centerWork()
        else if (this.room.memory.upgradeLinkId && this.room.memory.upgradeLinkId === this.id) this.upgradeWork()
        else this.sourceWork()
    },

    /**
     * 回调 - 建造完成
     * 分配默认职责，玩家不同意默认职责的话也可以手动调用 .as... 方法重新分配职责
     */
    onBuildComplete(): void {
        // 如果附近有 Source 就转换为 SourceLink
        const inRangeSources = this.pos.findInRange(FIND_SOURCES, 2)
        if (inRangeSources.length > 0) {
            this.asSource()
            return
        }

        // 在基地中心附近就转换为 CenterLink
        const center = this.room.memory.center
        if (center && this.pos.isNearTo(new RoomPosition(center[0], center[1], this.room.name))) {
            this.asCenter()
            return
        }

        // 否则就默认转换为 UpgraderLink
        this.asUpgrade()
    }
}