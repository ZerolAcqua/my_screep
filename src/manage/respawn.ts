import { log } from "@/modules/utils"
import { creepApi } from "@/manage/creepApi"
import { roles } from "@/role";



export const manageRespawn = {
    work: function () {
        // 遍历所有 creep 内存，检查其是否存在
        for (const name in Memory.creeps) {
            if (name in Game.creeps) continue

            // 如果 creep 已经凉了
            const creepConfig = Memory.creepConfigs[name]
            // 获取配置项
            if (!creepConfig) {
                log(`死亡 ${name} 未找到对应 creepConfig, 已删除`, ['creepController'])
                delete Memory.creeps[name]
                return
            }

            // 检查指定的 room 中有没有它的生成任务
            const spawnRoom = Game.rooms[creepConfig.spawnRoom]
            if (!spawnRoom) {
                log(`死亡 ${name} 未找到 ${creepConfig.spawnRoom}`, ['creepController'])
                return
            }

            // 如果有 isNeed 阶段并且该阶段返回 false 则遗弃该 creep
            if (roles[creepConfig.role].isNeed && !roles[creepConfig.role].isNeed(Game.rooms[creepConfig.spawnRoom], name, Memory.creeps[name])) {
                creepApi.remove(name)
                delete Memory.creeps[name]
                log(`死亡 ${name} 不需要重新孵化`, ['creepController'])
                return
            }

            // 加入生成，加入成功的话删除过期内存
            if (spawnRoom.addSpawnTask(name) != ERR_NAME_EXISTS) {
                delete Memory.creeps[name]
                log(`死亡 ${name} 准备重生孵化`, ['creepController'])
            }
        }
    },
    add: function (configName: string, role: CreepRoleConstant, data: CreepData, room: string, bodys: BodyAutoConfigConstant | BodyPartConstant[]) {
        log(creepApi.add(configName, role, data, room, bodys))
        const name = configName
        if (name in Game.creeps) {
            return
        }
        else {
            const spawnRoom = Game.rooms[room]
            spawnRoom.addSpawnTask(name)
        }
    }
};
