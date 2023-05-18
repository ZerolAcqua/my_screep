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