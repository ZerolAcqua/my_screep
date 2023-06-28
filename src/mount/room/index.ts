import { assignPrototype } from '@/modules/utils'
import { RoomExtension } from './extension'

// 挂载拓展到房间原型
export default () => {
    // 挂载所有拓展
    assignPrototype(Room, RoomExtension)
}
