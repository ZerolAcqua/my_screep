import { assignPrototype } from '@/utils'
import { CreepExtension } from './extension'

// 挂载拓展到房间原型
export default () => {
    // 挂载所有拓展
    assignPrototype(Creep, CreepExtension)
}
