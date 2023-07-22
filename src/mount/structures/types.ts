interface Structure {
    /**
     * 建筑运作
     */
    work(): void
    /**
     * 建筑建造完成时执行
     */
    onBuildComplete(): void
}

interface StructurePowerSpawn {
    
    /**
     * 用户操作 - 启动 powerSpawn
     */
    on(): string

    /**
     * 用户操作 - 关闭 powerSpawn
     */
    off(): string

    /**
     * 用户操作 - 查看 ps 运行状态
     */
    stats(): string

    /**
     * 用户操作 - 帮助信息
     */
    help(): string
}