import { read } from "fs";

/** 中央处理者角色
*   用于中央集群处理的角色
*/
export const roleProcessor = {
    /** 
     * @param {Creep} creep 
     */
    run: function (creep: Creep): void {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }
        if (creep.memory.working == true) {
            creep.transfer(Game.getObjectById(creep.room.memory['centerLinkId']) as Structure, RESOURCE_ENERGY)
        }
        else {
            const sources = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE;
                }
            }
            )
            creep.withdraw(sources[0], RESOURCE_ENERGY)
        }
    },
    /** 
     * @param {Creep} creep 
     */
    prepare: function (creep: Creep): void {
        const center = creep.room.memory.center
        if (creep.pos.x != center[0] || creep.pos.y != center[1]) {
            creep.moveTo(center[0], center[1])
        }
        else {
            creep.memory.ready = true
        }

    }
};