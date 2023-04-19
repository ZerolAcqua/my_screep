var roleDefender = {
    run: function(creep) {
    

        var hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
             if( creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
        }       
    }
}
module.exports = roleDefender;