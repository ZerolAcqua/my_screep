// 引入外部依赖
import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'

// 引入角色
import {
    roleHarvester,
    roleUpgrader,
    roleCarrier,
    roleBuilder,
    roleRepairer,
    roleDigger
} from './role/role.base'

// 引入重生管理

import { manageRespawn } from './manage/manage.Respawn'

import { mount } from './mount/mount'

mount()

// 游戏入口函数
export const loop = errorMapper(() => {

    
    if(Game.time%100==0){
        if(Game.cpu.bucket == 10000) {
            Game.cpu.generatePixel();
        }
    }


    // 清理内存
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // 房间防御与修理
    var room = Game.spawns.Spawn1.room;

    room.work();



    // respawn
    manageRespawn.run();

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
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
})



