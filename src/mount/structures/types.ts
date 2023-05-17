interface Structure{
    /**
     * 建筑运作
     */
    work():void
    /**
     * 建筑建造完成时执行
     */
    onBuildComplete():void
}


interface linkExtension {

    asSource(): void

    /**
     * 注册为中央 link
     */
    asCenter(): void

    /**
     * 注册为升级 link
     * 
     * 自己被动的给 upgrader 角色提供能量，所以啥也不做
     * 只是在房间内存里注册来方便其他 link 找到自己
     */
    asUpgrade(): void
    /**
     * 每次使用三个 as 时都要调用
     * 防止同时拥有多个角色
     */
    clearRegister()

    /**
    * 升级 link 执行工作
    */
    upgradeWork(): void


    /**
     * 扮演中央 link
     */
    centerWork(): void

    /**
     * 扮演能量提供 link
     * 
     * 如果房间内有 upgrede link 并且其没有能量时则把自己的能量转移给它
     */
    sourceWork(): void

    /**
     * 把能量发送给升级 Link
     * @returns 是否进行了发送
     */
    supportUpgradeLink(): boolean

    /**
     * 通过 room.memory 中指定字段名中的值获取 link
     * 如果没有找到对应的 link id 的话则清除该字段
     * @danger 请不要把该方法用在查找 link 之外的地方
     * 
     * @param memoryKey link 的 id 保存在哪个 room.memory 字段中
     */
    getLinkByMemoryKey(memoryKey: string): StructureLink | null



}
