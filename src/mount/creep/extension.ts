// // 将拓展签入 Creep 原型
// export function mountCreep() {
//     _.assign(Creep.prototype, creepExtension)
// }

// 引入角色
import {
    basicRoles,
} from '../../role/role.basic'

import {
    advancedRoles,
} from '../../role/role.advanced'

// 将角色字典拼接

const roles = { ...basicRoles, ...advancedRoles }


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


   // 采集能量
   harvestEnergy(sourcreId = 0): void {
       var sources = this.room.find(FIND_SOURCES);
       if (this.harvest(sources[sourcreId]) == ERR_NOT_IN_RANGE) {
           this.moveTo(sources[sourcreId]);
       }
   }
   // 采能者采集能量
   digEnergy(sourcreId = 0): void {
       var sources = this.room.find(FIND_SOURCES);
       var targets = sources[sourcreId].pos.findInRange(FIND_STRUCTURES, 2, {
           filter: { structureType: STRUCTURE_CONTAINER }
       })

       if (this.pos != targets[0].pos) {
           this.moveTo(targets[0]) == OK || this.moveTo(this.room.getPositionAt(15, 5)) // TODO: 临时解决方案
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
                   this.moveTo(this.room.getPositionAt(16, 5)) // 这里把坐标写死了
               }
               return
           }
       }

       this.moveTo(this.room.getPositionAt(16, 5));

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
       //             this.moveTo(sources[i])
       //         }
       //         return
       //     }
       // }

       // this.moveTo(targets[0]);

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
       //             this.moveTo(this.room.getPositionAt(16, 5)) // 这里把坐标写死了
       //         }
       //         return
       //     }
       // }

       // this.moveTo(this.room.getPositionAt(16, 5));

       if (this.moveTo(targets[0]) == OK) {
           this.withdraw(targets[0], RESOURCE_ENERGY)
       }

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
               this.moveTo(targets[0]);
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
               this.moveTo(targets[0]);
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
               this.moveTo(targets[0]);
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
               this.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
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
               this.moveTo(targets[0]);
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
               this.moveTo(targets[0]);
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
                   structure.hits < 0.1 * structure.hitsMax;
           }
       });
       if (targets.length == 0) {
           targets = this.room.find(FIND_STRUCTURES, {
               filter: (structure) => {
                   return structure.hits < 0.0005 * structure.hitsMax && structure.structureType == STRUCTURE_WALL;
               }
           });
       }
       if (targets.length > 0) {
           if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
               this.moveTo(targets[0]);
           }
           return true;
       }
       else {
           return false;
       }
   }

}
