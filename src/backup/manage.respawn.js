var manageRespawn = {

run: function() {
     

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        var hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
        
        //defender
        if(hostiles.length && defenders.length<hostiles.length)
        {
            var newName = 'Defender' + Game.time;
            console.log('Trying to spawn new defender: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                ATTACK,ATTACK,
                MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'defender'}});
                
        }
        
        // recover
        if(Game.creeps.length==0)
        {
            var newName = 'Harvester' + Game.time;
            console.log('Trying to spawn new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,
                                            CARRY,
                                            MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        // harvester respawn
        else if(harvesters.length < 1) {
            var newName = 'Harvester' + Game.time;
            console.log('Trying to spawn new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                            MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        // carrier respawn
        else if(carriers.length < 1) {
            var newName = 'Carrier' + Game.time;
            console.log('Trying to spawn new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                            MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'carrier'}});
        }        
        // upgrader respawn
        else if(upgraders.length < 1) {
            var newName = 'Upgrader' + Game.time;
            console.log('Trying to spawn new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                            MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }
        // builder respawn
        else if(builders.length < 1) {
            var newName = 'Builder' + Game.time;
            console.log('Trying to spawn new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                            CARRY,CARRY,CARRY,CARRY,CARRY,
                                            MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
        // repairer respawn
        else if(repairers.length < 1) {
            var newName = 'Repairer' + Game.time;
            console.log('Trying to spawn new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                            CARRY,CARRY,CARRY,CARRY,CARRY,
                                            MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'repairer'}});
        }

        
        
        
        if(Game.spawns['Spawn1'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                'respawn ' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1, 
                Game.spawns['Spawn1'].pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }
    
    
};

module.exports = manageRespawn;
