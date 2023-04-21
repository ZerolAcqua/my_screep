export const manageRespawn = {
    run: function () {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        // recover
        if (Game.creeps.length == 0) {
            var newName = 'Harvester' + Game.time;
            console.log('Trying to spawn new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK,
                    CARRY,
                    MOVE], newName,
                { memory: { role: 'harvester' } });
        }
        // harvester respawn
        else if (harvesters.length < 1) {
            var newName = 'Harvester' + Game.time;
            console.log('Trying to spawn new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK,
                    CARRY,
                    MOVE], newName,
                { memory: { role: 'harvester' } });
        }
        // repairer respawn
        else if (repairers.length < 2) {
            var newName = 'Repairer' + Game.time;
            console.log('Trying to spawn new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK, WORK,
                    CARRY, CARRY,
                    MOVE, MOVE], newName,
                { memory: { role: 'repairer' } });
        }

        // upgrader respawn
        else if (upgraders.length < 3) {
            var newName = 'Upgrader' + Game.time;
            console.log('Trying to spawn new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(
                [WORK,
                    CARRY,
                    MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
        // builder respawn
        else if (builders.length < 2) {
            var newName = 'Builder' + Game.time;
            console.log('Trying to spawn new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,
                CARRY,
                MOVE], newName,
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
