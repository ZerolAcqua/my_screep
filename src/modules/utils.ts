/**
 * 打印 hello world
 */
export const sayHello = function () {
    console.log('hello world')
}

/**
 * 生成 pixel
 */
export const generatePixel = function (): OK | ERR_NOT_ENOUGH_RESOURCES {
    if (Game.cpu.bucket == PIXEL_CPU_COST) return Game.cpu.generatePixel();
    else return ERR_NOT_ENOUGH_RESOURCES
}

/**
 * 清理死去的 creep 的内存
 */
export const clearDeadCreeps = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}