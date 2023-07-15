/**
 * @description 打印 hello world
 */
export function sayHello() {
    console.log('hello world')
}

/**
 * @description 生成 pixel
 */
export function generatePixel(): OK | ERR_NOT_ENOUGH_RESOURCES {
    if (Game.cpu.bucket == PIXEL_CPU_COST) return Game.cpu.generatePixel();
    else return ERR_NOT_ENOUGH_RESOURCES
}


/**
 * @author HoPGoldy
 * @abstract 判断是否为白名单玩家
 * 
 * @param creep 要检查的 creep
 * @returns 是否为白名单玩家
 */
export function whiteListFilter(creep) {
    if (!Memory.whiteList) return true
    // 加入白名单的玩家单位不会被攻击，但是会被记录
    if (creep.owner.username in Memory.whiteList) {
        Memory.whiteList[creep.owner.username] += 1
        return false
    }
    return true
}

/**
 * @author HoPGoldy
 * @abstract 全局统计信息扫描器
 * @description
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
export function stateScanner(): void {
    if (Game.time % 20) return

    if (!Memory.stats) Memory.stats = { rooms: {} }

    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100,
        Memory.stats.gclLevel = Game.gcl.level,
        Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100,
        Memory.stats.gplLevel = Game.gpl.level,
        // CPU 的当前使用量
        Memory.stats.cpu = Game.cpu.getUsed(),
        // bucket 当前剩余量
        Memory.stats.bucket = Game.cpu.bucket
    // 统计剩余钱数
    Memory.stats.credit = Game.market.credits
}


/**
 * @deprecated
 * @description 清理死去的 creep 的内存
 */
export function clearDeadCreeps () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

/**
 * @author ZerolAcqua
 * @description 生成身体部件数组
 * @param bodyPartDict 身体部件字典，字典的键为身体部件常量，值为对应的数量
 */
export function generBodyParts (bodyPartDict: { [key in BodyPartConstant]?: number }): BodyPartConstant[] {
    let bodyParts: BodyPartConstant[] = []
    for (let bodyPart in bodyPartDict) {
        for (let i = 0; i < bodyPartDict[bodyPart]; i++) {
            bodyParts.push(bodyPart as BodyPartConstant)
        }
    }
    return bodyParts
}

/**
 * @author ZerolAcqua
 * @description 判断身体部件参数的类型
 * @param bodys 身体部件
 */
export function isBodyPartConstantArray(bodys: BodyPartConstant[] | BodyAutoConfigConstant): bodys is BodyPartConstant[] {
    return Array.isArray(bodys);
}

/**
 * @author HoPGoldy
 * 在绘制控制台信息时使用的颜色
 */
const colors: { [name in Colors]: string } = {
    red: '#ef9a9a',
    green: '#6b9955',
    yellow: '#c5c599',
    blue: '#8dc5e3'
}

/**
 * @author HoPGoldy
 * 
 * 给指定文本添加颜色
 * 
 * @param content 要添加颜色的文本
 * @param colorName 要添加的颜色常量字符串
 * @param bolder 是否加粗
 */
export function colorful(content: string, colorName: Colors = null, bolder: boolean = false): string {
    const colorStyle = colorName ? `color: ${colors[colorName]};` : ''
    const bolderStyle = bolder ? 'font-weight: bolder;' : ''

    return `<text style="${[colorStyle, bolderStyle].join(' ')}">${content}</text>`
}

/**
 *  
 * @author HoPGoldy
 * 
 * 全局日志
 * 
 * @param content 日志内容
 * @param prefixes 前缀中包含的内容
 * @param color 日志前缀颜色
 * @param notify 是否发送邮件
 */
export function log(content: string, prefixes: string[] = [], color: Colors = null, notify: boolean = false): OK {
    // 有前缀就组装在一起
    let prefix = prefixes.length > 0 ? `【${prefixes.join(' ')}】 ` : ''
    // 指定了颜色
    prefix = colorful(prefix, color, true)

    const logContent = `${prefix}${content}`
    console.log(logContent)
    // 转发到邮箱
    if (notify) Game.notify(logContent)

    return OK
}


/**
 * @author HoPGoldy
 * @description 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
export function assignPrototype (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        }
        else obj1.prototype[key] = obj2.prototype[key]
    })
}