import mountGlobal from './global'
import mountCreep from './creep'
import mountPowerCreep from './powercreep'
import mountRoom from './room'
import mountStructure  from './structures'
import mountRoomPostion from './roomPosition'

/**
 * 挂载所有的属性和方法
 */
export default function (): void{
    
    if (!global.hasExtension) {
        console.log('[mount] 重新挂载拓展')

        mountGlobal()
        mountCreep()
        mountPowerCreep()
        mountRoom()
        mountStructure()
        mountRoomPostion()

        global.hasExtension = true
    }
}