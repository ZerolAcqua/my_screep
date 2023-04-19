var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    run: function(creep,resourceId=1) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('build');
	    }

	    if(creep.memory.building) {

	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_EXTENSION;
                            }
                        }
                    );
            if(!targets.length)
            {
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES
                    );
            }
	        
	        
	        
	        
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else 
            {
                roleUpgrader.run(creep);   
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[resourceId]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[resourceId], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;