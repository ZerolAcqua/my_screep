// 项目中出现的颜色常量
type Colors = 'green' | 'blue' | 'yellow' | 'red'

/**
 * @author HoPGoldy
 */
declare module NodeJS {
    // 全局对象
    interface Global {
        // 是否已经挂载拓展
        hasExtension: boolean
        // 全局的路径缓存
        // Creep 在执行远程寻路时会优先检查该缓存
        routeCache: {
            // 键为路径的起点和终点名，例如："12/32/W1N1 23/12/W2N2"，值是使用 Creep.serializeFarPath 序列化后的路径
            [routeKey: string]: string
        }
        // 全局缓存的订单价格表
        resourcePrice: {
            // 键为资源和订单类型，如："energy/buy"、"power/sell"，值是缓存下来的订单价格
            [resourceKey: string]: number
        }
    }
}

/**
 * @author HoPGoldy
 * Game 对象拓展
 */
interface Game {
    // 本 tick 是否已经执行了 creep 数量控制器了
    // 每 tick 只会调用一次
    _hasRunCreepNumberController: boolean
}


/**
 * @author HoPGoldy
 * @description 全局内存声明
 */
interface Memory {
    // 是否显示 cpu 消耗
    showCost?: boolean

    // 核弹投放指示器
    // 核弹是否已经确认
    nukerLock?: boolean
    // 核弹发射指令集，键为发射房间，值为目标旗帜名称
    nukerDirective?: {
        [fireRoomName: string]: string
    }

    // 全局的喊话索引
    sayIndex?: number
    // 白名单，通过全局的 whitelist 对象控制
    // 键是玩家名，值是该玩家进入自己房间的 tick 时长
    whiteList: {
        [userName: string]: number
    }
    // 掠夺资源列表，如果存在的话 reiver 将只会掠夺该名单中存在的资源
    reiveList: ResourceConstant[]
    // 要绕过的房间名列表，由全局模块 bypass 负责。
    bypassRooms: string[]
    // 资源来源表
    resourceSourceMap: {
        // 资源类型为键，房间名列表为值
        [resourceType: string]: string[]
    },
    // 商品生产线配置
    commodities: {
        // 键为工厂等级，值为被设置成对应等级的工厂所在房间名
        1: string[]
        2: string[]
        3: string[]
        4: string[]
        5: string[]
    }
    // 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
    creepConfigs: {
        [creepName: string]: {
            // creep 的角色名
            role: CreepRoleConstant,
            // creep 的具体配置项，每个角色的配置都不相同
            data: CreepData,
            // 执行 creep 孵化的房间名
            spawnRoom: string,
            // creep 孵化时使用的身体部件
            // 为 string 时则自动规划身体部件，为 BodyPartConstant[] 时则强制生成该身体配置
            bodys: BodyAutoConfigConstant | BodyPartConstant[]
        }
    }
    // 全局统计信息
    stats: {
        // GCl/GPL 升级百分比
        gcl?: number
        gclLevel?: number
        gpl?: number
        gplLevel?: number
        // CPU 当前数值及百分比
        cpu?: number
        // bucket 当前数值
        bucket?: number
        // 当前还有多少钱
        credit?: number

        // 已经完成的房间物流任务比例
        roomTaskNumber?: {
            [roomTransferTaskType: string]: number
        }

        /**
        * 房间内的数据统计
        */
        rooms: {
            [roomName: string]: {
                // storage 中的能量剩余量
                energy?: number
                // 终端中的 power 数量
                power?: number
                // nuker 的资源存储量
                nukerEnergy?: number
                nukerG?: number
                nukerCooldown?: number
                // 控制器升级进度，只包含没有到 8 级的
                controllerRatio?: number
                controllerLevel?: number

                // 其他种类的资源数量，由 factory 统计
                [commRes: string]: number
            }
        }
    }

    // 启动 powerSpawn 的房间名列表
    psRooms: string[]

    // 用于标记布局获取到了那一等级
    layoutLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}


// 所有的 creep 角色
type CreepRoleConstant = BaseRoleConstant | AdvancedRoleConstant | RemoteRoleConstant | WarRoleConstant

// 房间基础运营
type BaseRoleConstant =
    'harvester' |
    'collector' |
    'miner' |
    'upgrader' |
    'filler' |
    'builder' |
    'repairer'

// 房间高级运营
type AdvancedRoleConstant =
    'manager' |
    'processor'

// 远程单位
type RemoteRoleConstant =
    'claimer' |
    'reserver' |
    'signer' |
    'remoteBuilder' |
    'remoteUpgrader' |
    'remoteHarvester' |
    'depositHarvester' |
    'pbAttacker' |
    'pbHealer' |
    'pbCarrier' |
    'moveTester' |
    'reiver'

// 战斗单位
type WarRoleConstant =
    'soldier' |
    'doctor' |
    'boostDoctor' |
    'dismantler' |
    'boostDismantler' |
    'apocalypse' |
    'defender'

/**
 * 所有 creep 角色的 data
 */
type CreepData =
    EmptyData |
    ReiverData |
    HarvesterData |
    WorkerData |
    ProcessorData |
    RemoteHelperData |
    RemoteDeclarerData |
    RemoteHarvesterData |
    pbAttackerData |
    WarUnitData |
    ApocalypseData |
    HealUnitData

/**
 * 有些角色不需要 data
 */
interface EmptyData { }

/**
 * 采集单位的 data
 * 执行从 sourceId 处采集东西，并转移至 targetId 处（不一定使用，每个角色都有自己固定的目标例如 storage 或者 terminal）
 */
interface HarvesterData {
    // 要采集的 source id
    sourceId: string
    // 把采集到的资源存到哪里存在哪里
    targetId: string
}

/**
 * 工作单位的 data
 * 由于由确定的工作目标所以不需要 targetId
 */
interface WorkerData {
    // 要使用的资源存放建筑 id
    sourceId: string
}

/**
 * 中央运输者的 data 
 * x y 为其在房间中的固定位置
 */
interface ProcessorData {
    x: number
    y: number
}

/**
 * 远程协助单位的 data
 */
interface RemoteHelperData {
    // 要支援的房间名
    targetRoomName: string
    // 该房间中的能量来源
    sourceId: string
}

/**
 * 掠夺者单位的 ddata
 */
interface ReiverData {
    // 目标建筑上的旗帜名称
    flagName: string
    // 要搬运到的建筑 id
    targetId: string
}

/**
 * 远程声明单位的 data
 * 这些单位都会和目标房间的 controller 打交道
 */
interface RemoteDeclarerData {
    // 要声明控制的房间名
    targetRoomName: string
    // 自己出生的房间，claim 需要这个字段来向老家发布支援 creep
    spawnRoom?: string
    // 给控制器的签名
    signText?: string
}

/**
 * 远程采集单位的 data
 * 包括外矿采集和公路房资源采集单位
 */
interface RemoteHarvesterData {
    // 要采集的资源旗帜名称
    sourceFlagName: string
    // 资源要存放到哪个建筑里，外矿采集者必须指定该参数
    targetId?: string
    // 出生房名称，资源会被运输到该房间中
    spawnRoom?: string
}

interface pbAttackerData {
    // 要采集的资源旗帜名称
    sourceFlagName: string
    // 资源要存放到哪个建筑里，外矿采集者必须指定该参数
    healerCreepName: string
    // 出生房名称，资源会被运输到该房间中
    spawnRoom: string
}

/**
 * 战斗单位的 data
 */
interface WarUnitData {
    // 要攻击的旗帜名
    targetFlagName: string
    // 其治疗者名称，战斗单位会尽量保持该单位和自己相邻
    healerName?: string
    // 待命位置旗帜名
    // standByFlagName: string
    // 是否持续孵化
    keepSpawn: boolean
}

/**
 * 一体机战斗单位的 data
 */
interface ApocalypseData {
    // 要攻击的旗帜名
    targetFlagName: string
    // 抗几个塔的伤害，由这个参数决定其身体部件组成
    bearTowerNum: 0 | 1 | 2 | 3 | 4 | 5 | 6
    // 是否持续孵化
    keepSpawn: boolean
}

/**
 * 治疗单位的 data
 */
interface HealUnitData {
    // 要治疗的旗帜名
    creepName: string
    // 待命位置旗帜名
    // standByFlagName: string
    // 是否持续孵化
    keepSpawn?: boolean
}

/**
 * creep 的自动规划身体类型，以下类型的详细规划定义在 setting.ts 中
 */
type BodyAutoConfigConstant =
    'harvester' |
    'worker' |
    'upgrader' |
    'manager' |
    'processor' |
    'reserver' |
    'attacker' |
    'healer' |
    'dismantler' |
    'remoteHarvester'

interface ICreepConfig {
    // 每次死后都会进行判断，只有返回 true 时才会重新发布孵化任务
    isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean
    // 准备阶段执行的方法, 返回 true 时代表准备完成
    prepare?: (creep: Creep) => boolean
    // creep 获取工作所需资源时执行的方法
    // 返回 true 则执行 target 阶段，返回其他将继续执行该方法
    source?: (creep: Creep) => boolean
    // creep 工作时执行的方法,
    // 返回 true 则执行 source 阶段，返回其他将继续执行该方法
    target: (creep: Creep) => boolean
    // 每个角色默认的身体组成部分
    bodys: BodyAutoConfigConstant | BodyPartConstant[]
}

type CreepWork = {
    [role in CreepRoleConstant]: (data: CreepData) => ICreepConfig
}