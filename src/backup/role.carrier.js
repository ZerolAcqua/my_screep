var roleCarrier = {
    run: function(creep) {
        // switch condition
        if(!creep.memory.fetching && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.fetching = true;
            creep.say('fetching');
	    }
	    if(creep.memory.fetching && creep.store.getFreeCapacity() == 0) {
	        creep.memory.fetching = false;
	        creep.say('transfer');
	    }
        // transfer
        if(!creep.memory.fetching)
        {
            // to SPAWN
            if(Game.spawns.Spawn1.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            {
                if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns.Spawn1);
                }
            }
            else
            {
                // to EXTENSION
                 var targets = creep.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_EXTENSION) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                                }
                            });
                // to TOWER
                if(!targets.length){
                    targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });  
                }
                            
                            
                if(targets.length){
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                    }
                }
            }
        
        }
        else
        {
            var target = Game.getObjectById('61679c6e82bcac2b254e38d1');
            creep.moveTo(target.pos.x-1,target.pos.y);
            
            if(creep.pos.inRangeTo(target, 1))
            {
                creep.withdraw(target,RESOURCE_ENERGY)
            }
        }
    }
}
module.exports = roleCarrier;