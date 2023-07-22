import { createHelp } from '@/modules/help'
import { creepApi } from "@/modules/creepController"

// 全局拓展对象
export default {
    /**
     * Game.getObjectById 的别名
     * 
     * @param id 游戏对象的 id
     */
    get(id: string): any {
        return Game.getObjectById(id)
    },

    /**
     * Game.market.extendOrder 的别名
     * 
     * @param orderId 订单的 id
     * @param amount 要追加的数量
     */
    orderExtend(orderId: string, amount: number) {
        const actionResult = Game.market.extendOrder(orderId, amount)

        let returnString = ''
        if (actionResult === OK) returnString = '订单追加成功'
        else returnString = `订单追加失败，错误码 ${returnString}`

        return returnString
    },

    /**
     * 查询指定资源在各个房间中的数量
     * 
     * @param resourceName 要查询的资源名
     */
    seeres(resourceName: ResourceConstant): string {
        // 根据资源不同选择不同的查询目标
        const source = resourceName === RESOURCE_ENERGY ? STRUCTURE_STORAGE : STRUCTURE_TERMINAL
        let total = 0

        let log = `${resourceName} 的分布如下：\n`
        // 遍历所有房间并检查对应的存储建筑
        log += Object.values(Game.rooms).map(room => {
            // 统计数量
            const amount = room[source] ? (room[source].store[resourceName] || 0) : 0
            total += amount

            // 如果有就列出显示
            if (room[source] && amount > 0) return `${room.name} => ${amount}`
            else return false
        }).filter(res => res).join('\n')

        log += `\n共计: ${total}`
        return log
    },

    /**
     * 所有 creep 欢呼
     * 
     * @param content 要欢呼的内容
     * @param toPublic 是否对其他人可见
     */
    hail(content: string = '', toPublic: boolean = true): string {
        Object.values(Game.creeps).forEach(creep => creep.say(`${content}!`, toPublic))

        return content ? content : 'yeah!'
    },

    /**
     * 白名单控制 api
     * 挂载在全局，由玩家手动调用
     * 白名单仅应用于房间 tower 的防御目标，不会自动关闭 rempart，也不会因为进攻对象在白名单中而不攻击
     */
    whitelist: {
        /**
         * 添加用户到白名单
         * 重复添加会清空监控记录
         * 
         * @param userName 要加入白名单的用户名
         */
        add(userName: string): string {
            if (!Memory.whiteList) Memory.whiteList = {}
    
            Memory.whiteList[userName] = 0
    
            return `[白名单] 玩家 ${userName} 已加入白名单`
        },
    
        /**
         * 从白名单中移除玩家
         * 
         * @param userName 要移除的用户名
         */
        remove(userName: string): string {
            if (!(userName in Memory.whiteList)) return `[白名单] 该玩家未加入白名单`
    
            const enterTicks = Memory.whiteList[userName]
            delete Memory.whiteList[userName]
            // 如果玩家都删完了就直接移除白名单
            if (Object.keys(Memory.whiteList).length <= 0) delete Memory.whiteList
    
            return `[白名单] 玩家 ${userName} 已移出白名单，已记录的活跃时长为 ${enterTicks}`
        },
    
        /**
         * 显示所有白名单玩家及其活跃时长
         */
        show() {
            if (!Memory.whiteList) return `[白名单] 未发现玩家`
            const logs = [ `[白名单] 玩家名称 > 该玩家的单位在自己房间中的活跃总 tick 时长` ]
    
            // 绘制所有的白名单玩家信息
            logs.push(...Object.keys(Memory.whiteList).map(userName => `[${userName}] > ${Memory.whiteList[userName]}`))
    
            return logs.join('\n')
        },
    
        /**
         * 帮助
         */
        help() {
            return createHelp({
                name: '白名单模块',
                describe: '白名单中的玩家不会被房间的 tower 所攻击，但是会记录其访问次数',
                api: [
                    {
                        title: '添加新玩家到白名单',
                        params: [
                            { name: 'userName', desc: '要加入白名单的用户名' }
                        ],
                        functionName: 'add'
                    },
                    {
                        title: '从白名单移除玩家',
                        params: [
                            { name: 'userName', desc: '要移除的用户名' }
                        ],
                        functionName: 'remove'
                    },
                    {
                        title: '列出所有白名单玩家',
                        functionName: 'show'
                    }
                ]
            })
        }
    },
    creepApi
}