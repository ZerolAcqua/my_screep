// 引入外部依赖
import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'

import { roleHarvester } from './role/role.harvester'
import { roleUpgrader } from './role/role.upgrader'
import { roleBuilder } from './role/role.builder'
import { roleRepairer } from './role/role.repairer'

import { manageRespawn } from './manage/manage.Respawn'

import {mount} from './mount/mount'

mount()

// 游戏入口函数
export const loop = errorMapper(() => {
    // clear memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // respawn
    manageRespawn.run();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
})



