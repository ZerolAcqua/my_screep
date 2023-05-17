// 将拓展签入 Link 原型
export function mountLink() {
    _.assign(StructureLink.prototype, linkExtension)
}


// 自定义的 Link 的拓展
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
     * 分配职责
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
    },

    /**
    * 注册为源 link
    */
    asSource(): void {
        this.clearRegister()
    },

    /**
     * 注册为中央 link
     */
    asCenter(): void {
        this.clearRegister()
        this.room.memory.centerLinkId = this.id
    },

    /**
     * 注册为升级 link
     * 
     * 自己被动的给 upgrader 角色提供能量，所以啥也不做
     * 只是在房间内存里注册来方便其他 link 找到自己
     */
    asUpgrade(): void {
        this.clearRegister()
        this.room.memory.upgradeLinkId = this.id
    },

    /**
     * 每次使用三个 as 时都要调用
     * 防止同时拥有多个角色
     */
    clearRegister() {
        if (this.room.memory.centerLinkId == this.id) delete this.room.memory.centerLinkId
        if (this.room.memory.upgradeLinkId == this.id) delete this.room.memory.upgradeLinkId
    },

    /**
    * 升级 link 执行工作
    */
    upgradeWork(): void {

    },

    /**
     * 扮演中央 link
     */
    centerWork(): void {
        // 能量不足则待机
        if (this.store[RESOURCE_ENERGY] < 600) return

        // 优先响应 upgrade
        if (this.supportUpgradeLink()) return
    },

    /**
     * 扮演能量提供 link
     * 
     * 如果房间内有 upgrede link 并且其没有能量时则把自己的能量转移给它
     */
    sourceWork(): void {
        // 能量填满再发送
        if (<number>this.store.getUsedCapacity(RESOURCE_ENERGY) < 700) return

        // 优先响应 upgrade，在 8 级后这个检查用处不大，暂时注释了
        if (this.supportUpgradeLink()) return

        // 发送给 center link
        if (this.room.memory.centerLinkId) {
            const centerLink = this.getLinkByMemoryKey('centerLinkId')
            if (!centerLink || centerLink.store[RESOURCE_ENERGY] >= 799) return

            this.transferEnergy(centerLink)
        }
    },

    /**
     * 把能量发送给升级 Link
     * @returns 是否进行了发送
     */
    supportUpgradeLink(): boolean {
        if (this.room.memory.upgradeLinkId) {
            const upgradeLink = this.getLinkByMemoryKey('upgradeLinkId')
            // 如果 upgrade link 没能量了就转发给它
            if (upgradeLink && upgradeLink.store[RESOURCE_ENERGY] <= 100) {
                this.transferEnergy(upgradeLink)
                return true
            }
        }

        return false
    },

    /**
     * 通过 room.memory 中指定字段名中的值获取 link
     * 如果没有找到对应的 link id 的话则清除该字段
     * @danger 请不要把该方法用在查找 link 之外的地方
     * 
     * @param memoryKey link 的 id 保存在哪个 room.memory 字段中
     */
    getLinkByMemoryKey(memoryKey: string): StructureLink | null {
        const linkId = this.room.memory[memoryKey]
        if (!linkId) return null
        const link: StructureLink = Game.getObjectById(linkId) as StructureLink
        // 不存在说明 link 已经被摧毁了 清理并退出
        if (!link) {
            delete this.room.memory[memoryKey]
            return null
        }
        else return link
    }
}