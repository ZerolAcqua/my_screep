
/** 采集者角色
* 
*/
export const roleHarvester = {
        /** 
         * @param {Creep} creep 
         */
        run: function (creep:Creep) {
                if (creep.store.getFreeCapacity() > 0) {
                        creep.harvestEnergy(0)
                }
                else {
                        creep.fillSpawnEngery()
                }
        }
};

