import { assignPrototype } from '@/modules/utils'
import { CreepExtension } from './extension'

// 挂载拓展到 Creep 原型
export default () => {
    // 挂载所有拓展
    assignPrototype(Creep, CreepExtension)
}
