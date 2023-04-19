var roleHarvester = {

    run: function(creep) {

            var target = Game.getObjectById('61679c6e82bcac2b254e38d1');
            creep.moveTo(target);
            var sources = creep.room.find(FIND_SOURCES);
            creep.harvest(sources[0])


    //     // switch condition
    //     if(!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
    //         creep.memory.harvesting = true;
    //         creep.say('harvest');
	   // }
	   // if(creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
	   //     creep.memory.harvesting = false;
	   //     creep.say('transfer');
	   // }
    //     // transfer
    //     if(!creep.memory.harvesting)
    //     {
    //         // to SPAWN
    //         if(Game.spawns['Spawn1'].store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    //         {
    //             if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(Game.spawns['Spawn1']);
    //             }
    //         }
    //         else
    //         {
    //             // to EXTENSION
    //              var targets = creep.room.find(FIND_STRUCTURES, {
    //                             filter: (structure) => {
    //                                 return (structure.structureType == STRUCTURE_EXTENSION) &&
    //                                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    //                             }
    //                         });
    //             // to TOWER
    //             if(!targets.length){
    //                 targets = creep.room.find(FIND_STRUCTURES, {
    //                         filter: (structure) => {
    //                             return (structure.structureType == STRUCTURE_TOWER) &&
    //                             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    //                         }
    //                     });  
    //             }
                            
                            
    //             if(targets.length){
    //                     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //                         creep.moveTo(targets[0]);
    //                 }
    //             }
    //             else{
    //                 roleBuilder.run(creep,0);
    //             }
                    
    //         }
        
    //     }
    //     else
    //     {
    //       var sources = creep.room.find(FIND_SOURCES);
    //         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(sources[0]);
    //         }
    //     }
        
        // if (Game.spawns['Spawn1'].energy < Game.spawns['Spawn1'].energyCapacity)
        // {
        //     if(creep.store.getFreeCapacity() > 0) {
        //         var sources = creep.room.find(FIND_SOURCES);
        //         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(sources[0]);
        //         }
        //     }
        //     else if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(Game.spawns['Spawn1']);
        //     }
        // }
        // else
        // {
        //     var targets = creep.room.find(FIND_STRUCTURES, {
        //                     filter: (structure) => {
        //                         return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        //                         structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        //                     }
        //                 });
        
        
        //     if(targets.length){
        // 	    if(creep.store.getFreeCapacity() > 0) {
        //             var sources = creep.room.find(FIND_SOURCES);
        //             if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //                 creep.moveTo(sources[0]);
        //             }
        //         }
        //             else if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(targets[0]);
        //         }
        //     }
        //     else{
        //         roleBuilder.run(creep,0);
        //     }
            
        // }    
	}
};

module.exports = roleHarvester;