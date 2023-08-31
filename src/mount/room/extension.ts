import { createRoomLink, log } from "@/utils";
import { creepApi } from "@/modules/creepController";
import { isBodyPartConstantArray, whiteListFilter } from "@/utils";
import { ROOM_TRANSFER_TASK } from '@/setting'


/**
 * @description
 * 自定义的 Room 的拓展
 */
export class RoomExtension extends Room {
    /**
     * @author HoPGoldy
     * @abstract 全局日志
     * 
     * @param content 日志内容
     * @param prefixes 前缀中包含的内容
     * @param color 日志前缀颜色
     * @param notify 是否发送邮件
     */
    log(content: string, instanceName: string = '', color: Colors | undefined = undefined, notify: boolean = false): void {
        // 为房间名添加超链接
        const roomName = createRoomLink(this.name)
        // 生成前缀并打印日志
        const prefixes = instanceName ? [roomName, instanceName] : [roomName]
        log(content, prefixes, color, notify)
    }

    /**
     * @description
     * 设置房间中央集群核心位置
     * @param center 中央集群核心位置
     */
    public setCoreCenter(center: RoomPosition): void {
        this.memory.center = [center.x, center.y]
    }


    /**
     * 添加禁止通行位置
     * 
     * @param creepName 禁止通行点位的注册者
     * @param pos 禁止通行的位置
     */
    public addRestrictedPos(creepName: string, pos: RoomPosition): void {
        if (!this.memory.restrictedPos) this.memory.restrictedPos = {}

        this.memory.restrictedPos[creepName] = this.serializePos(pos)
    }

    /**
     * 获取房间内的禁止通行点位
     */
    public getRestrictedPos(): { [creepName: string]: string } {
        return this.memory.restrictedPos
    }

    /**
     * 将指定位置从禁止通行点位中移除
     * 
     * @param creepName 要是否点位的注册者名称
     */
    public removeRestrictedPos(creepName: string): void {
        if (!this.memory.restrictedPos) this.memory.restrictedPos = {}

        delete this.memory.restrictedPos[creepName]
    }

    /**
     * 将指定位置序列化为字符串
     * 形如: 12/32/E1N2
     * 
     * @param pos 要进行压缩的位置
     */
    public serializePos(pos: RoomPosition): string {
        return `${pos.x}/${pos.y}/${pos.roomName}`
    }

    /**
     * 将位置序列化字符串转换为位置
     * 位置序列化字符串形如: 12/32/E1N2
     * 
     * @param posStr 要进行转换的字符串
     */
    public unserializePos(posStr: string): RoomPosition | undefined {
        // 形如 ["12", "32", "E1N2"]
        const infos = posStr.split('/')

        return infos.length === 3 ? new RoomPosition(Number(infos[0]), Number(infos[1]), infos[2]) : undefined
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
        // this.doSpawnTask();

        // this.defendEnemy() || this.repairBuilding();

        if (!(Game.time % 20)) {
            this.stateScanner()
        }
    }

    //////////////////////////////////////////////////////////////////////////////

    /**
     * 向房间中发布 power 请求任务
     * 该方法已集成了 isPowerEnabled 判定，调用该方法之前无需额外添加房间是否启用 power 的逻辑
     * 
     * @param task 要添加的 power 任务
     * @param priority 任务优先级位置，默认追加到队列末尾。例：该值为 0 时将无视队列长度直接将任务插入到第一个位置
     * @returns OK 添加成功
     * @returns ERR_NAME_EXISTS 已经有同名任务存在了
     * @returns ERR_INVALID_TARGET 房间控制器未启用 power
     */
    public addPowerTask(task: PowerConstant, priority: number = null): OK | ERR_NAME_EXISTS | ERR_INVALID_TARGET {
        // 初始化时添加房间初始化任务（编号 -1）
        if (!this.memory.powerTasks) this.memory.powerTasks = [-1 as PowerConstant]
        if (!this.controller.isPowerEnabled) return ERR_INVALID_TARGET

        // 有相同的就拒绝添加
        if (this.hasPowerTask(task)) return ERR_NAME_EXISTS

        // 发布任务到队列
        if (!priority) this.memory.powerTasks.push(task)
        // 追加到队列指定位置
        else this.memory.powerTasks.splice(priority, 0, task)

        return OK
    }

    /**
     * 检查是否已经存在指定任务
     * 
     * @param task 要检查的 power 任务
     */
    private hasPowerTask(task: PowerConstant): boolean {
        return this.memory.powerTasks.find(power => power === task) ? true : false
    }

    /**
     * 获取当前的 power 任务
     */
    public getPowerTask(): PowerConstant | undefined {
        if (!this.memory.powerTasks || this.memory.powerTasks.length <= 0) return undefined
        else return this.memory.powerTasks[0]
    }

    /**
     * 挂起当前任务
     * 将会把最前面的 power 任务移动到队列末尾
     */
    public hangPowerTask(): void {
        const task = this.memory.powerTasks.shift()
        this.memory.powerTasks.push(task)
    }

    /**
     * 移除第一个 power 任务
     */
    public deleteCurrentPowerTask(): void {
        this.memory.powerTasks.shift()
    }

    ////////////////////////////////////////////////////

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
     * 将当前任务挂起
     * 任务会被移动至队列末尾
     */
    public hangSpawnTask(): void {
        const task = this.memory.spawnList.shift()
        this.memory.spawnList.push(task)
    }

    /**
     * 从生产队列中取出任务进行孵化
     * @brief 自编的临时函数
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
            let spawns = Object.values(Game.spawns).filter((spawn) => (spawn.room.name == this.name)) as StructureSpawn[]
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
     * @brief 自编的临时函数
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
            && !this.hasSpawnTask('builder1')
            && !("builder1" in Game.creeps)) {
            creepApi.add('builder1',
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
            this.addSpawnTask('builder1')
            log(`准备孵化 builder 建造建筑`, ['creepController'])
        }
    }

    //////////////////////////////////////////////////////////////

    /**
     * 向房间物流任务队列推送新的任务
     * 
     * @param task 要添加的任务
     * @param priority 任务优先级位置，默认追加到队列末尾。例：该值为 0 时将无视队列长度直接将任务插入到第一个位置
     * @returns 任务的排队位置, 0 是最前面，-1 为添加失败（已有同种任务）
     */
    public addRoomTransferTask(task: RoomTransferTasks, priority: number = null): number {
        if (this.hasRoomTransferTask(task.type)) return -1

        // 默认追加到队列末尾
        if (!priority) {
            this.memory.transferTasks.push(task)
            return this.memory.transferTasks.length - 1
        }
        // 追加到队列指定位置
        else {
            this.memory.transferTasks.splice(priority, 0, task)
            return priority < this.memory.transferTasks.length ? priority : this.memory.transferTasks.length - 1
        }
    }

    /**
     * 是否有相同的房间物流任务
     * 房间物流队列中一种任务只允许同时存在一个
     * 
     * @param taskType 任务类型
     */
    public hasRoomTransferTask(taskType: string): boolean {
        if (!this.memory.transferTasks) this.memory.transferTasks = []
        
        const task = this.memory.transferTasks.find(task => task.type === taskType)
        return task ? true : false
    }

    /**
     * 获取当前的房间物流任务
     */
    public getRoomTransferTask(): RoomTransferTasks | null {
        if (!this.memory.transferTasks) this.memory.transferTasks = []
        
        if (this.memory.transferTasks.length <= 0) {
            return null
        }
        else {
            return this.memory.transferTasks[0]
        }
    }


    /**
     * 更新 labIn 任务信息
     * @param resourceType 要更新的资源 id
     * @param amount 要更新成的数量
     */
    public handleLabInTask(resourceType: ResourceConstant, amount: number): boolean {
        const currentTask = <ILabIn>this.getRoomTransferTask()
        // 判断当前任务为 labin
        if (currentTask.type == ROOM_TRANSFER_TASK.LAB_IN) {
            // 找到对应的底物
            for (const index in currentTask.resource) {
                if (currentTask.resource[Number(index)].type == resourceType) {
                    // 更新底物数量
                    currentTask.resource[Number(index)].amount = amount
                    break
                }
            }
            // 更新对应的任务
            this.memory.transferTasks.splice(0, 1, currentTask)
            return true
        }
        else return false
    }

    /**
     * 移除当前处理的房间物流任务
     * 并统计至 Memory.stats
     */
    public deleteCurrentRoomTransferTask(): void {
        const finishedTask = this.memory.transferTasks.shift()

        // // 先兜底
        if (!Memory.stats) Memory.stats = { rooms: {} }
        if (!Memory.stats.roomTaskNumber) Memory.stats.roomTaskNumber = {}

        // 如果这个任务之前已经有过记录的话就增 1
        if (Memory.stats.roomTaskNumber[finishedTask.type]) Memory.stats.roomTaskNumber[finishedTask.type] += 1
        // 没有就设为 1
        else Memory.stats.roomTaskNumber[finishedTask.type] = 1
    }

    ///////////////////////////////////////////////////////////////////////////

    /** 
     * @description
     * 房间防御
     * @returns 是否执行了防御
     * @deprecated
     */
    defendEnemy(): boolean {
        var hostiles = this.find(FIND_HOSTILE_CREEPS, { filter: whiteListFilter });
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
                    // 初始值为 0.01 1,500,000
                    return (structure.hits < 1500000 && structure.structureType == STRUCTURE_RAMPART);
                }
            });
        }

        // wall
        if (!targets.length) {
            targets = this.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // 初始值为 0.0005
                    return structure.hits < 1200000 && structure.structureType == STRUCTURE_WALL;
                }
            });
            // // 对 targets 按 hits 从小到大排序
            // targets.sort((a, b) => floor(a.hits - b.hits)/1000);
        }



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
    private stateScanner() {
        if (!Memory.stats.rooms[this.name]) Memory.stats.rooms[this.name] = {}

        // 统计房间内爬的数量
        Memory.stats.rooms[this.name].creepNum = this.find(FIND_MY_CREEPS).length
    }
}
