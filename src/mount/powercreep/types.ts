
interface PowerCreep {

    // 用于保存原始 move，在 creepExtension 里会进行修改
    _move(direction: DirectionConstant | Creep): CreepMoveReturnCode | 
    OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS
    
    work(): void

    /**
     * 发送日志
     * 
     * @param content 日志内容
     * @param instanceName 发送日志的实例名
     * @param color 日志前缀颜色
     * @param notify 是否发送邮件
     */
    log(content: string, color: Colors, notify?: boolean): void

    /**
     * 给 powerCreep 指定工作房间
     * 
     * @param roomName 要进行生成的房间名
     */
    setWorkRoom(roomName: string): string

    /**
     * 前往 controller 启用房间中的 power
     * 
     * @returns OK 激活完成
     * @returns ERR_BUSY 正在激活中
     */
    enablePower(): OK | ERR_BUSY

    /**
     * 把自己的 power 能力信息更新到房间
     */
    updatePowerToRoom(): void


    myMove(target: DirectionConstant | Creep): CreepMoveReturnCode | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE
    goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
    requireCross(direction: DirectionConstant): Boolean


    /**
     * 从 terminal 中取出 ops
     * 
     * @param opsNumber 要拿取的数量
     * @returns OK 拿取完成
     * @returns ERR_NOT_ENOUGH_RESOURCES 资源不足
     * @returns ERR_BUSY 正在执行任务
     */
    getOps(opsNumber: number): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY
}


interface PowerCreepMemory {
    // 为 true 时执行 target，否则执行 source
    working: boolean
    // 接下来要检查哪个 power
    powerIndex: number
    // 当前要处理的工作
    // 字段值均为 PWR_* 常量
    // 在该字段不存在时将默认执行 PWR_GENERATE_OPS（如果 power 资源足够并且 ops 不足时）
    task: PowerConstant
    // 工作的房间名，在第一次出生时由玩家指定，后面会根据该值自动出生到指定房间
    workRoom: string

    // 要添加 REGEN_SOURCE 的 souce 在 room.sources 中的索引值
    sourceIndex?: number
}

