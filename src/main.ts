// 引入外部依赖
import { errorMapper } from './modules/errorMapper'

// 引入其他功能模块
import {
    generatePixel,
    clearDeadCreeps
} from './utils'

// 引入重生管理
import { manageRespawn } from './manage/respawn'



import mount from './mount'

import {creepConfigs} from '@/config'
import {creepApi} from '@/manage/creepApi'


for (const config of creepConfigs) {
    creepApi.add(config.configName, config.role as CreepRoleConstant, config.data, config.spawnRoom, config.bodys)
}


// 游戏入口函数
export const loop = errorMapper(() => {

    // 挂载原型拓展
    mount()


    // 生成 pixel
    generatePixel()
    

    // 房间运作
    const rooms = Object.values(Game.rooms) as Room[]
    rooms.forEach((room) => { room.work() })



    // creep 数量控制
    manageRespawn.work();

    // creep 运转
    const creeps = Object.values(Game.creeps) as Creep[]
    creeps.forEach((creep) => { creep.work() })
})



