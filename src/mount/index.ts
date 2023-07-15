import mountGlobal from './global'
import mountCreep from './creep'
import mountRoom from './room'
import mountStructure  from './structures'


/**
 * 挂载所有的属性和方法
 */
export default function (): void{
    
    if (!global.hasExtension) {
        console.log('[mount] 重新挂载拓展')

        mountGlobal()
        mountCreep()
        mountRoom()
        mountStructure()


        global.hasExtension = true
    }
}