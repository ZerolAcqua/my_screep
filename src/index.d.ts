/**
 * @author HoPGoldy
 * @abstract 项目中出现的颜色常量
 */ 
type Colors = 'green' | 'blue' | 'yellow' | 'red'

/**
 * @author HoPGoldy
 * @abstract 绘制帮助时需要的模块信息
 */
interface ModuleDescribe {
    // 模块名
    name: string
    // 模块介绍
    describe: string
    // 该模块的 api 列表
    api: FunctionDescribe[]
}

// 函数介绍构造函数的参数对象
interface FunctionDescribe {
    // 该函数的用法
    title: string
    // 参数介绍
    describe?: string
    // 该函数的参数列表
    params?: {
        // 参数名
        name: string
        // 参数介绍
        desc: string
    }[]
    // 函数名
    functionName: string
    // 是否为直接执行类型：不需要使用 () 就可以执行的命令
    commandType?: boolean
}

/**
 * @author HoPGoldy
 */
declare module NodeJS {
    // 全局对象
    interface Global {
        // 是否已经挂载拓展
        hasExtension: boolean
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
    creepConfigs: {
        [configName: string]: {
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
    },
    psRooms?: string[],
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
                creepNum?: number

                // 其他种类的资源数量，由 factory 统计
                [commRes: string]: number
            }
        }
    },
    // 白名单
    whiteList?: {
        [playerName: string]: number
    }

    // 要绕过的房间名列表，由全局模块 bypass 负责。
    bypassRooms: string[]
}

//
type StructureStore = StructureContainer | StructureStorage | StructureLink | StructureTerminal


/**
 * @author HoPGoldy
 * @abstract 每种 power 所对应的的任务配置项
 * 
 * @property {} needExecute 该 power 的检查方法
 * @property {} run power 的具体工作内容
 */
interface IPowerTaskConfig {
    /**
     * power 的资源获取逻辑
     * 
     * @returns OK 任务完成，将会执行下面的 target 方法
     * @returns ERR_NOT_ENOUGH_RESOURCES 资源不足，将会强制切入 ops 生成任务
     * @returns ERR_BUSY 任务未完成，保留工作状态，后续继续执行
     */
    source?: (creep: PowerCreep) => OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY
    /**
     * power 的具体工作逻辑
     * 
     * @returns OK 任务完成，将会继续检查后续 power
     * @returns ERR_NOT_ENOUGH_RESOURCES 资源不足，将会执行上面的 source 方法，如果没有 source 的话就强制切入 ops 生成任务
     * @returns ERR_BUSY 任务未完成，保留工作状态，后续继续执行
     */
    target: (creep: PowerCreep) => OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY
}

/**
 * @author HoPGoldy
 * @abstract 所有 power 的任务配置列表
 */
interface IPowerTaskConfigs {
    [powerType: string]: IPowerTaskConfig
}

/**
 * 工厂的任务队列中的具体任务配置
 */
interface IFactoryTask {
    // 任务目标
    target: CommodityConstant,
    // 该任务要生成的数量
    amount: number
}

// 所有的 creep 角色
type CreepRoleConstant = BaseRoleConstant | AdvancedRoleConstant

// 房间基础角色
type BaseRoleConstant =
    'harvester' |
    'digger' |
    'carrier' |
    'upgrader' |
    'builder' |
    'repairer'

// 房间高级角色
type AdvancedRoleConstant =
    'processor'


/**
 * 所有 creep 角色的 data
 */
type CreepData =
    EmptyData |
    CarrierData |
    ProcessorData |
    WorkerData

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
 * @Todo
 * 采集单位的 data
 * 执行从 sourceId 处采集东西，并转移至 targetId 处（不一定使用，每个角色都有自己固定的目标例如 storage 或者 terminal）
 */
interface CarrierData {
    // 要采集的 source id
    sourceId: string
    // 把采集到的资源存到哪里存在哪里
    targetId?: string
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
 * creep 的自动规划身体类型，以下类型的详细规划定义在 setting.ts 中
 */
type BodyAutoConfigConstant =
    'harvester' |
    'repairer' |
    'builder' |
    'upgrader' |
    'carrier' |
    'digger' |
    'worker' |
    'processor'

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

// /**
//  * @author HoPGoldy
//  * @description 全局内存声明
//  */
// interface Memory {
//     // 是否显示 cpu 消耗
//     showCost?: boolean

//     // 核弹投放指示器
//     // 核弹是否已经确认
//     nukerLock?: boolean
//     // 核弹发射指令集，键为发射房间，值为目标旗帜名称
//     nukerDirective?: {
//         [fireRoomName: string]: string
//     }

//     // 全局的喊话索引
//     sayIndex?: number
//     // 白名单，通过全局的 whitelist 对象控制
//     // 键是玩家名，值是该玩家进入自己房间的 tick 时长
//     whiteList: {
//         [userName: string]: number
//     }
//     // 掠夺资源列表，如果存在的话 reiver 将只会掠夺该名单中存在的资源
//     reiveList: ResourceConstant[]
//     // 要绕过的房间名列表，由全局模块 bypass 负责。
//     bypassRooms: string[]
//     // 资源来源表
//     resourceSourceMap: {
//         // 资源类型为键，房间名列表为值
//         [resourceType: string]: string[]
//     },
//     // 商品生产线配置
//     commodities: {
//         // 键为工厂等级，值为被设置成对应等级的工厂所在房间名
//         1: string[]
//         2: string[]
//         3: string[]
//         4: string[]
//         5: string[]
//     }
//     // 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
//     creepConfigs: {
//         [creepName: string]: {
//             // creep 的角色名
//             role: CreepRoleConstant,
//             // creep 的具体配置项，每个角色的配置都不相同
//             data: CreepData,
//             // 执行 creep 孵化的房间名
//             spawnRoom: string,
//             // creep 孵化时使用的身体部件
//             // 为 string 时则自动规划身体部件，为 BodyPartConstant[] 时则强制生成该身体配置
//             bodys: BodyAutoConfigConstant | BodyPartConstant[]
//         }
//     }
//     // 全局统计信息
//     stats: {
//         // GCl/GPL 升级百分比
//         gcl?: number
//         gclLevel?: number
//         gpl?: number
//         gplLevel?: number
//         // CPU 当前数值及百分比
//         cpu?: number
//         // bucket 当前数值
//         bucket?: number
//         // 当前还有多少钱
//         credit?: number

//         // 已经完成的房间物流任务比例
//         roomTaskNumber?: {
//             [roomTransferTaskType: string]: number
//         }

//         /**
//         * 房间内的数据统计
//         */
//         rooms: {
//             [roomName: string]: {
//                 // storage 中的能量剩余量
//                 energy?: number
//                 // 终端中的 power 数量
//                 power?: number
//                 // nuker 的资源存储量
//                 nukerEnergy?: number
//                 nukerG?: number
//                 nukerCooldown?: number
//                 // 控制器升级进度，只包含没有到 8 级的
//                 controllerRatio?: number
//                 controllerLevel?: number

//                 // 其他种类的资源数量，由 factory 统计
//                 [commRes: string]: number
//             }
//         }
//     }

//     // 启动 powerSpawn 的房间名列表
//     psRooms: string[]

//     // 用于标记布局获取到了那一等级
//     layoutLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
// }

