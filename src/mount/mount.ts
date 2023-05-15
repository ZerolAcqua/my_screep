import { mountCreep } from './creep/mount.creep'
import { mountRoom } from './room/mount.room'
import { mountStructure } from './structures/mount.structure'

// import mountFlag from './mount.flag'


// 挂载所有的额外属性和方法
export function mount() {
    console.log('[mount] 重新挂载拓展')

    mountCreep()
    mountRoom()
    mountStructure()
    // mountFlag()
    // 其他更多拓展...
}