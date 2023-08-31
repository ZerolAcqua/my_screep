// 引入外部依赖
import { errorMapper } from './modules/errorMapper'

// 引入其他功能模块
import {
    generatePixel,
    stateScanner
} from './utils'

// 引入重生管理
import creepNumberListener from '@/modules/creepController'



import mount from './mount'

import {creepConfigs} from '@/config'
import {creepApi} from '@/modules/creepController'

// 临时解决方案
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
    const rooms = Object.values(Game.rooms).filter((room)=>( room.controller && room.controller.my )) as Room[]
    rooms.forEach((room) => { room.work() })

    // creep 数量控制
    creepNumberListener();

    
    // creep 运转
    const creeps = Object.values(Game.creeps) as Creep[]
    creeps.forEach((creep) => { 
        // console.log(creep.name, creep.memory.role, creep.memory.working)
        creep.work()
    })


    
    // powercreep 运转
    const powerCreeps = Object.values(Game.powerCreeps) as PowerCreep[]
    powerCreeps.forEach((powerCreep) => { if(powerCreep.work)powerCreep.work() })



    // 全局统计数据
    stateScanner()
})



