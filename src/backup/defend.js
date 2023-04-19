var defend = {
    
 run: function(room) {
        var hostiles =room.find(FIND_HOSTILE_CREEPS);
        var towers = room.find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }   
};

module.exports = defend;