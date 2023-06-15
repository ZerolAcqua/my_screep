/**
 * @description 打印 hello world
 */
export const sayHello = function () {
    console.log('hello world')
}

/**
 * @description 生成 pixel
 */
export const generatePixel = function (): OK | ERR_NOT_ENOUGH_RESOURCES {
    if (Game.cpu.bucket == PIXEL_CPU_COST) return Game.cpu.generatePixel();
    else return ERR_NOT_ENOUGH_RESOURCES
}

/**
 * @deprecated
 * @description 清理死去的 creep 的内存
 */
export const clearDeadCreeps = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

/**
 * @author: ZerolAcqua
 * @description: 生成身体部件数组
 * @param bodyPartDict 身体部件字典，字典的键为身体部件常量，值为对应的数量
 */

export const generBodyParts = function (bodyPartDict: {[key in BodyPartConstant]?: number}): BodyPartConstant[] {
    let bodyParts: BodyPartConstant[] = []
    for (let bodyPart in bodyPartDict) {
        for (let i = 0; i < bodyPartDict[bodyPart]; i++) {
            bodyParts.push(bodyPart as BodyPartConstant)
        }
    }
    return bodyParts
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

    return `<text style="${[ colorStyle, bolderStyle ].join(' ')}">${content}</text>`
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
export const assignPrototype = function (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
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