// 引入外部依赖
import { errorMapper } from './modules/errorMapper'

// 引入其他功能模块
import {
    generatePixel,
    clearDeadCreeps
} from './modules/utils'

// 引入角色
import {
    roleHarvester,
    roleUpgrader,
    roleCarrier,
    roleBuilder,
    roleRepairer,
    roleDigger
} from './mount/creep/role/role.base'

import {
    roleProcessor,
} from './mount/creep/role/role.advance'


// 引入重生管理
import { manageRespawn } from './manage/manage.Respawn'


// 挂载原型拓展
import { mount } from './mount/mount'
mount()

// 游戏入口函数
export const loop = errorMapper(() => {


    // 生成 pixel
    generatePixel()


    // 清理 creeps 内存
    clearDeadCreeps()

    // 房间运作
    const rooms = Object.values(Game.rooms) as Room[]
    rooms.forEach((room) => {room.work()})
    

    
    // creep 数量控制
    manageRespawn.work();

    // creep 运转
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'digger') {
            roleDigger.run(creep);
        }
        if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            if (creep.memory.ready) roleUpgrader.run(creep)
            else roleUpgrader.prepare(creep)
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role == 'processor') {
            if (creep.memory.ready) roleProcessor.run(creep)
            else roleProcessor.prepare(creep)
        }
    }
})



