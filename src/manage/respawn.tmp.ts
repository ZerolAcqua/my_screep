export const manageRespawn = {
    work: function () {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var diggers = _.filter(Game.creeps, (creep) => creep.memory.role == 'digger');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
        var processors = _.filter(Game.creeps, (creep) => creep.memory.role == 'processor');

        // recover
        if (Object.keys(Game.creeps).length == 0) {
            var newName = 'harvester';
            console.log('Trying to spawn new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK,
                    CARRY,
                    MOVE], newName,
                { memory: { role: 'harvester' } });
        }
        // digger respawn
        else if (diggers.length < 1) {
            var newName = 'digger1';
            console.log('Trying to spawn new digger: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK, WORK, WORK, WORK,
                    MOVE], newName,
                { memory: { role: 'digger' } });
        }
        // carrier respawn
        else if (carriers.length < 1) {
            var newName = 'carrier1';
            console.log('Trying to spawn new carrier: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE], newName,
                { memory: { role: 'carrier' } });
        }
        // processor respawn
        else if (processors.length < 1) {
            var newName = 'processor';
            console.log('Trying to spawn new processor: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [CARRY, CARRY,
                    MOVE], newName,
                { memory: { role: 'processor' } });
        }


        // repairer respawn
        else if (repairers.length < 0) {
            var newName = 'repairer';
            console.log('Trying to spawn new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK, WORK, WORK,
                    CARRY, CARRY,
                    MOVE, MOVE, MOVE], newName,
                { memory: { role: 'repairer' } });
        }

        // upgrader respawn
        else if (upgraders.length < 1) {
            var newName = 'upgrader';
            console.log('Trying to spawn new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK, WORK, WORK, WORK,
                    CARRY,
                    MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
        // builder respawn
        else if (builders.length < 1 && Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            var newName = 'builder';
            console.log('Trying to spawn new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([
                WORK, WORK, WORK, 
                CARRY, CARRY,CARRY,
                MOVE, MOVE, MOVE], newName,
                { memory: { role: 'builder' } });
        }


        // display respawn
        if (Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                'respawn ' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                { align: 'left', opacity: 0.8 });
        }
    }


};
