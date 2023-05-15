import { floor } from "lodash";

// 将拓展签入 Room 原型
export function mountRoom() {
    _.assign(Room.prototype, roomExtension)
}


// 自定义的 Room 的拓展
const roomExtension = {

    /**
     * 房间运作
     */
    work(): void {
        this.defendEnemy() || this.repairBuilding();
    },

    /**
     * 房间孵化
     * @param creepName 要孵化的 creep 名称
     */
    addSpawnTask(creepName: string): void {

    },

    // 房间防御
    defendEnemy(): boolean {
        var hostiles = this.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            var towers = this.find(
                FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            towers.forEach(tower => tower.attack(hostiles[0]));
            return true;
        }
        else {
            return false
        }

    },

    // 房间修理
    repairBuilding(): boolean {
        var towers = this.find(
            FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        // 1.rampart
        var targets = this.find(FIND_STRUCTURES, {
            filter: (structure) => {
                // 初始值为 0.01
                return (structure.hits < 0.05
                    * structure.hitsMax && structure.structureType == STRUCTURE_RAMPART);
            }
        });
        // 2.container
        if (!targets.length) {
            targets = this.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < 0.9 * structure.hitsMax && structure.structureType == STRUCTURE_CONTAINER;
                }
            });
        }
        // 3.wall
        if (!targets.length) {
            targets = this.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    // 初始值为 0.0005
                    return structure.hits < 0.0010 * structure.hitsMax && structure.structureType == STRUCTURE_WALL;
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

    // 其他更多自定义拓展

}