var manageRespawn = require('manage.respawn');
var defend = require('defend');
var towerRepair = require('repair')

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleCarrier = require('role.carrier');
var roleDefender = require('role.defender');


module.exports.loop = function () {

    // clear memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //defend
    var hostiles =Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0)
    {
        defend.run( Game.spawns.Spawn1.room,hostiles)
    }
    else
    {
        towerRepair.run( Game.spawns.Spawn1.room,hostiles)
    }
    
    
    
    // respawn
    manageRespawn.run();
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
    }
}