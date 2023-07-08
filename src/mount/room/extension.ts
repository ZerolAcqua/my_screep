import { manageRespawn } from "@/manage/respawn";
import { log } from "@/modules/utils";
import { creepApi } from "@/manage/creepApi";
import {isBodyPartConstantArray} from "@/modules/utils";

/**
 * @description
 * 自定义的 Storage 的拓展
 */
export class RoomExtension extends Room {

    /**
     * @description
     * 设置房间中央集群核心位置
     * @param center 中央集群核心位置
     */
    public setCoreCenter(center: RoomPosition): void {
        this.memory.center = [center.x, center.y]
    }


    /**
     * @description
     * 房间运作
     */
    public work(): void {

        const structures = this.find(FIND_MY_STRUCTURES);

        structures.forEach((structure) => {
            structure.work();
        })

        this.addBuildTask();
        this.doSpawnTask();

        this.defendEnemy() || this.repairBuilding();

        if (!(Game.time % 20)) { 
            this.stateScanner()
        }
    }

    /**
     * @description
     * 添加房间孵化任务
     * @param creepName 要孵化的 creep 名称
     * @todo 未完成
     */
    public addSpawnTask(creepName: string): number | ERR_NAME_EXISTS {
        if (!this.memory.spawnList) this.memory.spawnList = []
        // 先检查下任务是不是已经在队列里了
        if (!this.hasSpawnTask(creepName)) {
            // 任务加入队列
            this.memory.spawnList.push(creepName)
            return this.memory.spawnList.length - 1
        }
        // 如果已经有的话返回异常
        else return ERR_NAME_EXISTS
    }

    /**
     * 检查生产队列中是否包含指定任务
     * 
     * @param taskName 要检查的任务名
     * @returns true/false 有/没有
     */
    public hasSpawnTask(taskName: string): boolean {
        if (!this.memory.spawnList) this.memory.spawnList = []
        return this.memory.spawnList.indexOf(taskName) > -1
    }

    /**
     * 从生产队列中取出任务进行孵化
     * @todo 这里写死了房间的 Spawn 名字，需要改成自动获取
     * @bug
     * @returns OK| ERR_NOT_ENOUGH_ENERGY| ERR_BUSY
     */
    public doSpawnTask(): ScreepsReturnCode {
        if (!this.memory.spawnList || this.memory.spawnList.length == 0) {
            return ERR_NOT_FOUND
        }
        else {
            // let spawn = Game.spawns['Spawn1']
            let spawns = Object.values(Game.spawns).filter((spawn)=>(spawn.room.name == this.name)) as StructureSpawn[]
            for (const spawn of spawns) {
                if (spawn && !spawn.spawning) {
                    let creepName = this.memory.spawnList[0]
                    let creepConfig = Memory.creepConfigs[creepName]
                    if (creepConfig) {
                        // FIXME
                        if (isBodyPartConstantArray(creepConfig.bodys)) { 
                            let returnCode = spawn.spawnCreep(creepConfig.bodys as BodyPartConstant[], creepName, { memory: { 'role': creepConfig.role } })
                            if (returnCode == OK) {
                                this.memory.spawnList.shift()
                                console.log(`spawn ${spawn.name} spawn ${creepName} successfully`)
                                continue
                            }
                            else if (returnCode == ERR_NAME_EXISTS) {
                                this.memory.spawnList.shift()
                            }
                        }
                        else {
                            console.log("I didn't consider this situation")
                        }
                    }
                    else {
                        console.log(`${creepName}'s creepConfig: \n ${creepConfig} \n not found`)
                        this.memory.spawnList.shift()
                    }
                }
                else {
                    console.log(`spawn ${spawn.name} not found or busy`)   
                    continue
                }
            }
            return ERR_INVALID_ARGS
        }
    }


    /**
     * @description
     * 在需要孵化建造者时进行孵化
     * @deprecated 这个函数有点套娃，需要重构
     * @todo 这里判断 builder 是否存在应该分离一个函数出来
     *      而不是直接找叫 builder 的 creep
     * @bug
     * 
     * @returns OK| ERR_NOT_ENOUGH_ENERGY| ERR_BUSY
     */
    public addBuildTask() {
        if (this.find(FIND_CONSTRUCTION_SITES).length > 0
            && !this.hasSpawnTask('builder')
            && !("builder" in Game.creeps)) {
            creepApi.add('builder',
                'builder',
                {
                    "sourceId": "6448fd1495671c3b6ec1b799"
                },
                'W27S34',
                [
                    WORK, WORK, WORK, WORK,
                    CARRY, CARRY,
                    MOVE, MOVE, MOVE
                ]
            )
            this.addSpawnTask('builder')
            log(`准备孵化 builder 建造建筑`, ['creepController'])
        }
    }


    /** 
     * @description
     * 房间防御
     * @returns 是否执行了防御
     */
    defendEnemy(): boolean {
        var hostiles = this.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            var towers: StructureTower[] = this.find(
                FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            towers.forEach(tower => tower.attack(hostiles[0]));
            return true;
        }
        else {
            return false
        }

    }

    /** 
     * @description
     * 房间修理
     * @returns 是否执行了修理
     */
    repairBuilding(): boolean {
        var towers: StructureTower[] = this.find(
            FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

        var targets = []

        // road
        if (!targets.length) {
            targets = this.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_ROAD;
                }
            });
        }


        // container
        if (!targets.length) {
            targets = this.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER;
                }
            });
        }


        // rampart
        if (!targets.length) {
            targets = this.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // 初始值为 0.01
                    return (structure.hits < 1500000 && structure.structureType == STRUCTURE_RAMPART);
                }
            });
        }

        // // wall
        // if (!targets.length) {
        //     targets = this.find(FIND_STRUCTURES, {
        //         filter: (structure) => {
        //             // 初始值为 0.0005
        //             return structure.hits < 0.0010 * structure.hitsMax && structure.structureType == STRUCTURE_WALL;
        //         }
        //     });
        //     // // 对 targets 按 hits 从小到大排序
        //     // targets.sort((a, b) => floor(a.hits - b.hits)/1000);
        // }



        for (let i = 0; i < towers.length; i++) {
            if (towers[i].store.getFreeCapacity(RESOURCE_ENERGY) < 0.5 * towers[i].store.getCapacity(RESOURCE_ENERGY)) {
                towers[i].repair(targets[0]);
            }
        }
        return true;
    }

    /**
     * @description 统计房间信息
     * 
     */
        private stateScanner(){
            if (!Memory.stats.rooms[this.name]) Memory.stats.rooms[this.name] = {}
    
            // 统计房间内爬的数量
            Memory.stats.rooms[this.name].creepNum = this.find(FIND_MY_CREEPS).length
        }

}
