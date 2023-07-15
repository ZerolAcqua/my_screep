import Shortcut from './shortcut'
import { assignPrototype } from '@/utils'
import { RoomExtension } from './extension'

// 定义好挂载顺序
const plugins = [ Shortcut, RoomExtension]

// 挂载拓展到房间原型
export default () => {
    // 挂载所有拓展
    plugins.forEach(plugin => assignPrototype(Room, plugin))
}
