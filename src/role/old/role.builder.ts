import { roleUpgrader } from './role.upgrader'

/** 建造者角色
* 
*/
export const roleBuilder = {
    /** @param {Creep} creep **/
    run: function (creep:Creep, resourceId=0) {
        
	    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        creep.say('build');
	    }

	    if(creep.memory.working) {
            if(creep.buildStructure() == false)
            {
                roleUpgrader.run(creep);   
            }
	    }

	    else {
	        
	    }
    }
};

