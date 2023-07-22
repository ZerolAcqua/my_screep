// 引入角色
import { roles } from '@/role'
import { getOppositeDirection } from '@/utils'


/**
 * @description
 * 自定义的 creep 的拓展
 */
export class CreepExtension extends Creep {

    // Creep 执行工作
    work(): void {
        if ("prepare" in roles[this.memory.role] && !this.memory.ready)
            roles[this.memory.role].prepare(this)
        else
            roles[this.memory.role].run(this)
    }


    // Creep 的状态是否应该继续工作（只适用于需要能量运作的爬）
    shouldWork(): boolean {
        if (this.memory.working && this.store[RESOURCE_ENERGY] == 0) {
            this.memory.working = false
        }
        else if (!this.memory.working && this.store.getFreeCapacity() == 0) {
            this.memory.working = true
        }
        return this.memory.working
    }

    // 寻找指定位置附近的 Link
    findLink(pos: RoomPosition): string | null {
        var targets = pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        });
        if (targets.length > 0) {
            return targets[0].id
        }
        return null
    }


    // 寻找指定位置附近的储物点，优先级为 Storage > Link > Container
    findStore(pos: RoomPosition): string | null {
        var targets = pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            return targets[0].id
        }
        targets = pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            return targets[0].id
        }
        targets = pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            return targets[0].id
        }
        return null
    }

    // 从目标结构获取能量
    public getEngryFrom(target: Structure | Source): ScreepsReturnCode {
        let result: ScreepsReturnCode
        // 是建筑就用 withdraw
        if (target instanceof Structure) result = this.withdraw(target as Structure, RESOURCE_ENERGY)
        // 不是的话就用 harvest
        else {
            result = this.harvest(target as Source)

            // harvest 需要长时间占用该位置，所以需要禁止对穿
            // withdraw 则不需要
            // if (result === OK) {
            //     // 开始采集能量了就拒绝对穿
            //     if (!this.memory.standed) {
            //         this.room.addRestrictedPos(this.name, this.pos)
            //         this.memory.standed = true
            //     }
            // }
        }

        // if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos)
        if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos)


        return result
    }

    // 转移资源到结构
    public transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode {
        // 转移能量实现
        // this.goTo(target.pos)
        this.goTo(target.pos)
        return this.transfer(target, RESOURCE)
    }


    // 采集能量
    harvestEnergy(sourcreId = 0): void {
        var sources = this.room.find(FIND_SOURCES);
        if (this.harvest(sources[sourcreId]) == ERR_NOT_IN_RANGE) {
            this.goTo(sources[sourcreId].pos);
        }
    }
    // 采能者采集能量
    digEnergy(sourcreId = 0): void {
        var sources = this.room.find(FIND_SOURCES);
        var targets = sources[sourcreId].pos.findInRange(FIND_STRUCTURES, 2, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })

        if (this.pos != targets[0].pos) {
            this.goTo(targets[0].pos) == OK || this.goTo(this.room.getPositionAt(15, 5)) // TODO: 临时解决方案
        }
        this.harvest(sources[sourcreId]) == ERR_NOT_IN_RANGE
    }
    // 收集能量
    gatherEnergy(): void {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })
        var sources = targets[0].pos.findInRange(FIND_DROPPED_RESOURCES, 1)

        for (var i = 0; i < sources.length; i++) {
            if (sources[i].amount > 100) {
                if (this.pickup(sources[i]) == ERR_NOT_IN_RANGE) {
                    this.goTo(this.room.getPositionAt(16, 5)) // 这里把坐标写死了
                }
                return
            }
        }

        this.goTo(this.room.getPositionAt(16, 5));

        if (this.pos.inRangeTo(targets[0], 1)) {
            this.withdraw(targets[0], RESOURCE_ENERGY)
        }
    }
    // 收取能量
    withdrawEnergy(): void {
        // var targets = this.room.find(FIND_STRUCTURES, {
        //     filter: { structureType: STRUCTURE_CONTAINER }
        // })
        // var sources = targets[0].pos.findInRange(FIND_DROPPED_RESOURCES, 1)

        // for (var i = 0; i < sources.length; i++) {
        //     if (sources[i].amount > 100) {
        //         if (this.pickup(sources[i]) == ERR_NOT_IN_RANGE) {
        //             this.goTo(sources[i])
        //         }
        //         return
        //     }
        // }

        // this.goTo(targets[0]);

        // if (this.pos.inRangeTo(targets[0], 1)) {
        //     this.withdraw(targets[0], RESOURCE_ENERGY)
        // }

        // TODO: 临时解决方案
        // var targets = this.room.find(FIND_STRUCTURES, {
        //     filter: { structureType: STRUCTURE_CONTAINER }
        // })
        // TODO: 临时解决方案
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
        })
        // var sources = targets[0].pos.findInRange(FIND_DROPPED_RESOURCES, 1)

        // for (var i = 0; i < sources.length; i++) {
        //     if (sources[i].amount > 100) {
        //         if (this.pickup(sources[i]) == ERR_NOT_IN_RANGE) {
        //             this.goTo(this.room.getPositionAt(16, 5)) // 这里把坐标写死了
        //         }
        //         return
        //     }
        // }

        // this.goTo(this.room.getPositionAt(16, 5));

        if (this.goTo(targets[0].pos) == OK) {
            this.withdraw(targets[0], RESOURCE_ENERGY)
        }

    }

    /**
     * 远程寻路
     * 
     * @param target 目标位置
     * @param range 搜索范围 默认为 1
     * @returns PathFinder.search 的返回值
     */
    public findPath(target: RoomPosition, range: number): string | null {
        if (!this.memory.farMove) this.memory.farMove = {}
        this.memory.farMove.index = 0

        // 先查询下缓存里有没有值
        const routeKey = `${this.room.serializePos(this.pos)} ${this.room.serializePos(target)}`
        let route = global.routeCache[routeKey]
        // 如果有值则直接返回
        if (route) {
            return route
        }

        const result = PathFinder.search(this.pos, { pos: target, range }, {
            plainCost: 2,
            swampCost: 10,
            maxOps: 4000,
            roomCallback: roomName => {
                // 强调了不许走就不走
                if (Memory.bypassRooms && Memory.bypassRooms.includes(roomName)) return false

                const room = Game.rooms[roomName]
                // 房间没有视野
                if (!room) return

                let costs = new PathFinder.CostMatrix

                room.find(FIND_STRUCTURES).forEach(struct => {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        costs.set(struct.pos.x, struct.pos.y, 1)
                    }
                    // 不能穿过无法行走的建筑
                    else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
                    ) costs.set(struct.pos.x, struct.pos.y, 0xff)
                })

                // 避开房间中的禁止通行点
                const restrictedPos = room.getRestrictedPos()
                for (const creepName in restrictedPos) {
                    // 自己注册的禁止通行点位自己可以走
                    if (creepName === this.name) continue
                    const pos = room.unserializePos(restrictedPos[creepName])
                    costs.set(pos.x, pos.y, 0xff)
                }

                return costs
            }
        })

        // 寻路失败就通知玩家
        // if (result.incomplete) {
        //     const states = [
        //         `[${this.name} 未完成寻路] [游戏时间] ${Game.time} [所在房间] ${this.room.name}`,
        //         `[creep 内存]`,
        //         JSON.stringify(this.memory, null, 4),
        //         `[寻路结果]`,
        //         JSON.stringify(result)
        //     ]
        //     Game.notify(states.join('\n'))
        // }

        // 没找到就返回 null
        if (result.path.length <= 0) return null
        // 找到了就进行压缩
        route = this.serializeFarPath(result.path)
        // 保存到全局缓存
        if (!result.incomplete) global.routeCache[routeKey] = route

        return route
    }

    /**
     * 压缩 PathFinder 返回的路径数组
     * 
     * @param positions 房间位置对象数组，必须连续
     * @returns 压缩好的路径
     */
    public serializeFarPath(positions: RoomPosition[]): string {
        if (positions.length == 0) return ''
        // 确保路径的第一个位置是自己的当前位置
        if (!positions[0].isEqualTo(this.pos)) positions.splice(0, 0, this.pos)

        return positions.map((pos, index) => {
            // 最后一个位置就不用再移动
            if (index >= positions.length - 1) return null
            // 由于房间边缘地块会有重叠，所以这里筛除掉重叠的步骤
            if (pos.roomName != positions[index + 1].roomName) return null
            // 获取到下个位置的方向
            return pos.getDirectionTo(positions[index + 1])
        }).join('')
    }

    /**
     * 使用缓存进行移动
     * 该方法会对 creep.memory.farMove 产生影响
     * 
     * @returns ERR_NO_PATH 找不到缓存
     * @returns ERR_INVALID_TARGET 撞墙上了
     */
    public goByCache(): CreepMoveReturnCode | ERR_NO_PATH | ERR_NOT_IN_RANGE | ERR_INVALID_TARGET  | ERR_INVALID_ARGS{
        if (!this.memory.farMove) return ERR_NO_PATH

        const index = this.memory.farMove.index
        // 移动索引超过数组上限代表到达目的地
        if (index >= this.memory.farMove.path.length) {
            delete this.memory.farMove.path
            return OK
        }

        // 获取方向，进行移动
        const direction = <DirectionConstant>Number(this.memory.farMove.path[index])
        const goResult = this.move(direction)

        // 移动成功，更新下次移动索引
        if (goResult == OK) this.memory.farMove.index++

        return goResult
    }


    /**
     * 向指定方向移动
     * 
     * @param target 要移动到的方向
     * @returns ERR_INVALID_TARGET 发生撞停
     */

    public my_move(target: DirectionConstant | Creep):  CreepMoveReturnCode | OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS {
        // const baseCost = Game.cpu.getUsed()
        // 进行移动，并分析其移动结果，OK 时才有可能发生撞停
        const moveResult = this._move(target) 

        if (moveResult != OK || target instanceof Creep) return moveResult

        const currentPos = `${this.pos.x}/${this.pos.y}`
        // 如果和之前位置重复了就分析撞上了啥
        if (this.memory.prePos && currentPos == this.memory.prePos) {
            // 尝试对穿，如果自己禁用了对穿的话则直接重新寻路
            const crossResult = this.memory.disableCross ? ERR_BUSY : this.mutualCross(target)

            // 没找到说明撞墙上了或者前面的 creep 拒绝对穿，重新寻路
            if (crossResult != OK) {
                delete this.memory._move
                return ERR_BUSY
            }
        }

        // 没有之前的位置或者没重复就正常返回 OK 和更新之前位置
        this.memory.prePos = currentPos

        return OK
    }


    // _move(direction: DirectionConstant): CreepMoveReturnCode
    // _move(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS

    // /**
    //  * 向指定方向移动
    //  * 
    //  * @param direction 要移动到的方向
    //  * @returns ERR_INVALID_TARGET 发生撞停
    //  */
    // myMove(direction: DirectionConstant): CreepMoveReturnCode{
    //     // const baseCost = Game.cpu.getUsed()
    //     // 进行移动，并分析其移动结果，OK 时才有可能发生撞停
    //     const moveResult = this._move(direction)

    //     if (moveResult != OK) return moveResult

    //     const currentPos = `${this.pos.x}/${this.pos.y}`
    //     // 如果和之前位置重复了就分析撞上了啥
    //     if (this.memory.prePos && currentPos == this.memory.prePos) {
    //         // 尝试对穿，如果自己禁用了对穿的话则直接重新寻路
    //         const crossResult = this.memory.disableCross ? ERR_BUSY : this.mutualCross(direction)

    //         // 没找到说明撞墙上了或者前面的 creep 拒绝对穿，重新寻路
    //         if (crossResult != OK) {
    //             delete this.memory._move
    //             return ERR_INVALID_TARGET
    //         }
    //     }

    //     // 没有之前的位置或者没重复就正常返回 OK 和更新之前位置
    //     this.memory.prePos = currentPos

    //     return OK
    // }

    // myMove(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS{
    //     return this._move(target)
    // }


    /**
     * 无视 Creep 的寻路
     * 
     * @param target 要移动到的位置
     */
    public goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
        // const baseCost = Game.cpu.getUsed()
        const moveResult = this.moveTo(target, {
            reusePath: 20,
            ignoreCreeps: true,
            costCallback: (roomName, costMatrix) => {
                if (roomName === this.room.name) {
                    // 避开房间中的禁止通行点
                    const restrictedPos = this.room.getRestrictedPos()
                    for (const creepName in restrictedPos) {
                        // 自己注册的禁止通行点位自己可以走
                        if (creepName === this.name) continue

                        const pos = this.room.unserializePos(restrictedPos[creepName])
                        costMatrix.set(pos.x, pos.y, 0xff)
                    }
                }

                return costMatrix
            }
        })

        return moveResult
    }


    /**
     * 向指定方向发起对穿
     * 
     * @param direction 要进行对穿的方向
     * @returns OK 成功对穿
     * @returns ERR_BUSY 对方拒绝对穿
     * @returns ERR_NOT_FOUND 前方没有 creep
     */
    public mutualCross(direction: DirectionConstant): OK | ERR_BUSY | ERR_NOT_FOUND {
        // 获取前方位置上的 creep（fontCreep）
        const fontPos = this.pos.directionToPos(direction)
        if (!fontPos) return ERR_NOT_FOUND

        const fontCreep = fontPos.lookFor(LOOK_CREEPS)[0] || fontPos.lookFor(LOOK_POWER_CREEPS)[0]
        if (!fontCreep) return ERR_NOT_FOUND

        this.say(`👉`)
        // 如果前面的 creep 同意对穿了，自己就朝前移动
        if (fontCreep.requireCross(getOppositeDirection(direction))) this._move(direction)
        else return

        return OK
    }

    /**
     * 请求对穿
     * 自己内存中 standed 为 true 时将拒绝对穿
     * 
     * @param direction 请求该 creep 进行对穿
     */
    public requireCross(direction: DirectionConstant): Boolean {
        // this 下没有 memory 说明 creep 已经凉了，直接移动即可
        if (!this.memory) return true

        // 拒绝对穿
        if (this.memory.standed) {
            this.say('👊')
            return false
        }

        // 同意对穿
        this.say('👌')
        this._move(direction)
        return true
    }



    // 填充所有 spawn 和 extension
    fillSpawnEngery(): boolean {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });


        if (targets.length == 0) {
            var targets = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }

        if (targets.length > 0) {
            if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }

    }

    // 填充所有 tower
    fillTower(): boolean {
        // to TOWER
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }


    // 填充 storage
    fillStorage(): boolean {
        // to storage
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }

    // 填充 terminal
    fillTerminal(): boolean {
        // to terminal
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_TERMINAL }
        });
        if (targets.length > 0) {
            if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }

    // 建造建筑
    buildStructure(): boolean {
        // 先找 extension
        var targets = this.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        }
        );
        // 再找其他建筑
        if (!targets.length) {
            var targets = this.room.find(FIND_CONSTRUCTION_SITES
            );
        }

        // 找到就去建造
        if (targets.length > 0) {
            if (this.build(targets[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }
    // 其他更多自定义拓展

    // 修理 container
    repairContainer(): boolean {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.hits < 0.9 * structure.hitsMax;
            }
        });
        if (targets.length > 0) {
            if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }

    // 修理 road
    repairRoad(): boolean {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD) &&
                    structure.hits < 0.9 * structure.hitsMax;
            }
        });
        if (targets.length > 0) {
            if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }

    // 修理 rampart 和 wall
    repairRamptWall(): boolean {
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART || structure.structureType == STRUCTURE_WALL) &&
                    structure.hits < 0.005 * structure.hitsMax;
            }
        });
        if (targets.length == 0) {
            targets = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 2 / 300 * structure.hitsMax && structure.structureType == STRUCTURE_WALL;
                }
            });
        }
        if (targets.length > 0) {
            if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(targets[0].pos);
            }
            return true;
        }
        else {
            return false;
        }
    }

}
