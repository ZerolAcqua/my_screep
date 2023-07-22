import { assignPrototype } from '@/utils'
import { CreepExtension } from './extension'

// 挂载拓展到 Creep 原型
export default () => {

    // 保存原始 move，在 creepExtension 里会进行修改
    if (!Creep.prototype._move) Creep.prototype._move = Creep.prototype.move
    // 挂载所有拓展
    assignPrototype(Creep, CreepExtension)


    Creep.prototype.move = Creep.prototype.my_move as any
    Creep.prototype.my_move = undefined
}
