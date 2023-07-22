import { colorful, createRoomLink, createConst, createLink } from '@/utils'
import { createHelp } from '@/modules/help'
import '@/mount/structures/types'

export default [
// 常用的资源常量
{
    alias: 'res',
    exec: function(): string {
        return resourcesHelp
    }
},
{
    alias: 'help',
    exec: function(): string {
        return [
            ...projectTitle.map(line => colorful(line, 'blue', true)),
        
            `\n半自动 AI，调用指定房间 help 方法来查看更详细的帮助信息 (如：${colorful('Game.rooms.W1N1.help', 'yellow')}())。在 ${colorful('Link, Factory, Terminal, PowerSpawn, Observer', 'yellow')} 对象实例上也包含对应的 help 方法。\n`,

            createHelp(
                {
                    name: '全局指令',
                    describe: '直接输入就可以执行，不需要加 ()',
                    api: [
                        {
                            title: '查看资源常量',
                            commandType: true,
                            functionName: 'res'
                        },
                        {
                            title: '查看启用的 ps 状态',
                            commandType: true,
                            functionName: 'ps'
                        }
                    ]
                },
                {
                    name: '全局方法',
                    describe: '定义在全局的函数，优化手操体验',
                    api: [
                        {
                            title: '获取游戏对象',
                            describe: 'Game.getObjectById 方法的别名',
                            params: [
                                { name: 'id', desc: '要查询的对象 id' }
                            ],
                            functionName: 'get'
                        },
                        {
                            title: '追加订单容量',
                            describe: 'Game.market.extendOrder 方法的别名',
                            params: [
                                { name: 'orderId', desc: '订单的 id' },
                                { name: 'amount', desc: '要追加的数量' }
                            ],
                            functionName: 'orderExtend'
                        },
                        {
                            title: '查询指定资源',
                            describe: '全局搜索资源的数量以及所处房间',
                            params: [
                                { name: 'resourceName', desc: '要查询的资源名' }
                            ],
                            functionName: 'seeres'
                        },
                        {
                            title: '欢呼',
                            params: [
                                { name: 'content', desc: '欢呼内容' },
                                { name: 'toPublic', desc: '[可选] 其他人是否可见，默认为 true' },
                            ],
                            functionName: 'hail'
                        }
                    ]
                },
            )
        ].join('\n')
    }
},
// 查看当前启用的 powerSpawn 工作状态
{
    alias: 'ps',
    exec: function(): string {
        if (!Memory.psRooms || Memory.psRooms.length <= 0) return `没有正在工作的 powerSpawn，在 powerSpawn 对象实例上执行 .on() 方法来进行激活。`
        // 下面遍历是会把正常的房间名放在这里面
        const workingPowerSpawn = []

        // 遍历保存的所有房间，统计 ps 状态
        const stats = Memory.psRooms.map(roomName => {
            const room = Game.rooms[roomName]
            if (!room || !room.powerSpawn) return `[${roomName}] 无法访问该房间或该房间中的 powerSpawn，已移除。请重新尝试对该 powerSpawn 执行 .on()`
            workingPowerSpawn.push(roomName)

            return room.powerSpawn.stats()
        }).join('\n')

        // 更新可用的房间名
        Memory.psRooms = workingPowerSpawn
        return stats
    }
},
// 统计当前所有房间的存储状态
{
    alias: 'storage',
    exec: function(): string {
        // 建筑容量在小于如下值时将会变色
        const colorLevel = {
            [STRUCTURE_TERMINAL]: { warning: 60000, danger: 30000 },
            [STRUCTURE_STORAGE]: { warning: 150000, danger: 50000 }
        }

        /**
         * 给数值添加颜色
         * 
         * @param capacity 要添加颜色的容量数值
         * @param warningLimit 报警的颜色等级
         */
        const addColor = (capacity: number, structureType: STRUCTURE_TERMINAL | STRUCTURE_STORAGE): string => {
            if (!capacity) return colorful('无法访问', 'red')
            return capacity > colorLevel[structureType].warning ? colorful(capacity.toString(), 'green') : 
                capacity > colorLevel[structureType].danger ? colorful(capacity.toString(), 'yellow') : colorful(capacity.toString(), 'red')
        }

        const logs = [
            `剩余容量/总容量 [storage 报警限制] ${colorful(colorLevel[STRUCTURE_STORAGE].warning.toString(), 'yellow')} ${colorful(colorLevel[STRUCTURE_STORAGE].danger.toString(), 'red')} [terminal 报警限制] ${colorful(colorLevel[STRUCTURE_TERMINAL].warning.toString(), 'yellow')} ${colorful(colorLevel[STRUCTURE_TERMINAL].danger.toString(), 'red')}`,
            '',
            ...Object.values(Game.rooms).map(room => {
                // 如果两者都没有或者房间无法被控制就不显示
                if ((!room.storage && !room.terminal) || !room.controller) return false

                let log = `[${room.name}] `
                if (room.storage) log += `STORAGE: ${addColor(room.storage.store.getFreeCapacity(), STRUCTURE_STORAGE)}/${room.storage.store.getCapacity() || '无法访问'} `
                else log += 'STORAGE: X '

                if (room.terminal) log += `TERMINAL: ${addColor(room.terminal.store.getFreeCapacity(), STRUCTURE_TERMINAL)}/${room.terminal.store.getCapacity() || '无法访问'} `
                else log += 'TERMINAL: X '

                return log
            }).filter(log => log)
        ]

        return logs.join('\n')
    }
},
/**
 * 把房间挂载到全局
 * 来方便控制台操作，在访问时会实时的获取房间对象
 * 注意：仅会挂载 Memory.rooms 里有的房间
 */
...Object.keys(Memory.rooms || {}).map(roomName => ({
    alias: roomName,
    exec: (): Room => Game.rooms[roomName]
}))
]

/**
 * @author HoPGoldy
 * @abstract 帮助文档中的标题
 */
const projectTitle = [
    String.raw`        __  __      ____  ______      __    __         _____                               `,
    String.raw`       / / / /___  / __ \/ ____/___  / /___/ /_  __   / ___/_____________  ___  ____  _____`,
    String.raw`      / /_/ / __ \/ /_/ / / __/ __ \/ / __  / / / /   \__ \/ ___/ ___/ _ \/ _ \/ __ \/ ___/`,
    String.raw`     / __  / /_/ / ____/ /_/ / /_/ / / /_/ / /_/ /   ___/ / /__/ /  /  __/  __/ /_/ (__  ) `,
    String.raw`    /_/ /_/\____/_/    \____/\____/_/\__,_/\__, /   /____/\___/_/   \___/\___/ .___/____/  `,
    String.raw`                                          /____/                            /_/              openSource at github - ${createLink('hopgoldy/screeps-ai', 'https://github.com/HoPGoldy/my-screeps-ai')}`
]

// 资源常量控制台帮助
const resourcesHelp: string = `
${createConst('O', 'RESOURCE_OXYGEN')}              ${createConst('H', 'RESOURCE_HYDROGEN')}         ${createConst('U', 'RESOURCE_UTRIUM')}             ${createConst('X', 'RESOURCE_CATALYST')}
${createConst('压缩O', 'RESOURCE_OXIDANT')}         ${createConst('压缩H', 'RESOURCE_REDUCTANT')}     ${createConst('压缩U', 'RESOURCE_UTRIUM_BAR')}     ${createConst('压缩X', 'RESOURCE_PURIFIER')}
${createConst('L', 'RESOURCE_LEMERGIUM')}           ${createConst('K', 'RESOURCE_KEANIUM')}          ${createConst('Z', 'RESOURCE_ZYNTHIUM')}           ${createConst('G', 'RESOURCE_GHODIUM')} 
${createConst('压缩L', 'RESOURCE_LEMERGIUM_BAR')}   ${createConst('压缩K', 'RESOURCE_KEANIUM_BAR')}   ${createConst('压缩Z', 'RESOURCE_ZYNTHIUM_BAR')}   ${createConst('压缩G', 'RESOURCE_GHODIUM_MELT')}

${createConst('TOUGH强化', 'RESOURCE_CATALYZED_GHODIUM_ALKALIDE')}   ${createConst('RANGE_ATTACK强化', 'RESOURCE_CATALYZED_KEANIUM_ALKALIDE')}
${createConst('MOVE强化', 'RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE')}   ${createConst('HEAL强化', 'RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE')}
`