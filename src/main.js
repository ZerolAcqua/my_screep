// 引入外部依赖
import { errorMapper } from './modules/errorMapper'
import { sayHello } from './modules/utils'


// 游戏入口函数
export const loop = errorMapper(() => {
    sayHello()
})

