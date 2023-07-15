import { assignPrototype } from '@/utils'
import { LinkExtension } from './link'
import { StorageExtension } from './storage'
import { StructureExtension } from './structure'
import { TerminalExtension } from './terminal'
import { FactoryExtension } from './factory'
import { ControllerExtension } from './controller'
import { ObserverExtension } from './observer'
import { NukerExtension } from './nuker'
import { PowerSpawnExtension } from './powerSpawn'
import { TowerExtension } from './tower'


// 拓展和原型的对应关系
const assignMap = [
    [ Structure, StructureExtension ],
    [ StructureLink, LinkExtension ],
    [ StructureStorage, StorageExtension ],
    [ StructureTerminal, TerminalExtension ],
    [ StructureFactory, FactoryExtension ],
    [ StructureController, ControllerExtension ],
    [ StructureObserver, ObserverExtension ],
    [ StructureNuker, NukerExtension ],
    [ StructurePowerSpawn, PowerSpawnExtension ],
    [ StructureTower, TowerExtension ]
]

// 挂载拓展到建筑原型
export default () => {
    // 挂载所有拓展
    assignMap.forEach(protos => assignPrototype(protos[0], protos[1]))
}