// pc 空闲时会搓 ops，下面是搓的上限
export const maxOps = 50000

// 房间建筑维修需要的设置
export const repairSetting = {
    // 在 tower 的能量高于该值时才会刷墙
    energyLimit: 600, 
    // 普通建筑维修的检查间隔
    // checkInterval: 8, 
    checkInterval: 5, 
    // 墙壁维修的检查间隔
    // wallCheckInterval: 1, 
    wallCheckInterval: 2,
    // 墙壁的关注时间
    focusTime: 100
}

/**
 * 此处定义了所有的房间物流任务类型
 * 每个房间物流的任务的 type 属性都必须是下列定义之一
 */
export const ROOM_TRANSFER_TASK = {
    // 基础运维
    FILL_EXTENSION: 'fillExtension',
    FILL_TOWER: 'fillTower',
    // nuker 填充
    FILL_NUKER: 'fillNuker',
    // lab 物流
    LAB_IN: 'labIn',
    LAB_OUT: 'labOut',
    LAB_GET_ENERGY: 'labGetEnergy',
    FILL_POWERSPAWN: 'fillPowerSpawn',
    // boost 物流
    BOOST_GET_RESOURCE: 'boostGetResource',
    BOOST_GET_ENERGY: 'boostGetEnergy',
    BOOST_CLEAR: 'boostClear'
}

// 用于维持房间能量正常运转的重要角色
export const importantRoles: CreepRoleConstant[] = [ 'harvester', 'distributor', 'processor' ]

// creep 的默认内存
export const creepDefaultMemory: CreepMemory = {
    role: 'harvester', 
    ready: false, 
    working: false
}

