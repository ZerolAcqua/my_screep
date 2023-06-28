import { assignPrototype } from '@/modules/utils'
import { LinkExtension } from './link'
import { StorageExtension } from './storage'
import { StructureExtension } from './structure'
import { TerminalExtension } from './terminal'
import { ControllerExtension } from './controller'



// 拓展和原型的对应关系
const assignMap = [
    [ Structure, StructureExtension ],
    [ StructureLink, LinkExtension ],
    [ StructureStorage, StorageExtension ],
    [ StructureTerminal, TerminalExtension ],
    [ StructureController, ControllerExtension ]    
]

// 挂载拓展到建筑原型
export default () => {
    // 挂载所有拓展
    assignMap.forEach(protos => assignPrototype(protos[0], protos[1]))
}