// 将拓展签入 Creep 原型
export function mountCreep() {
    _.assign(Creep.prototype, creepExtension)
}

// 自定义的 Creep 的拓展
const creepExtension = {
    // 采集能量
    harvestEnergy(sourcreId = 0) {
        var sources = this.room.find(FIND_SOURCES);
        if (this.harvest(sources[sourcreId]) == ERR_NOT_IN_RANGE) {
            this.moveTo(sources[sourcreId]);
        }
    },
    // 采能者采集能量
    digEnergy(sourcreId = 0) {
        var sources = this.room.find(FIND_SOURCES);
        var target = sources[sourcreId].pos.findInRange(FIND_STRUCTURES, 2, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })

        if (this.pos != target[0].pos) {
            this.moveTo(target[0])
        }
        this.harvest(sources[sourcreId]) == ERR_NOT_IN_RANGE
    },
    // 收取能量
    withdrawEnergy() {
        var target = this.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })
        var sources = target[0].pos.findInRange(FIND_DROPPED_RESOURCES, 1)

        for (var i = 0; i < sources.length; i++) {
            if (sources[i].amount > 100) {
                if (this.pickup(sources[i]) == ERR_NOT_IN_RANGE) {
                    this.moveTo(sources[i])
                }
                return
            }
        }


        this.moveTo(target[0]);

        if (this.pos.inRangeTo(target[0], 1)) {
            this.withdraw(target[0], RESOURCE_ENERGY)
        }
    },

    // 填充所有 spawn 和 extension
    fillSpawnEngery() {
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

        if (targets.length) {
            if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0]);
            }
            return true;
        }
        else {
            return false;
        }

    },

    // 填充所有 tower
    fillTower() {
        // to TOWER
        var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length) {
            if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0]);
            }
            return true;
        }
        else {
            return false;
        }
    },

    // 建造建筑
    buildStructure() {
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
                this.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
            return true;
        }
        else {
            return false;
        }
    },
    // 其他更多自定义拓展

}
