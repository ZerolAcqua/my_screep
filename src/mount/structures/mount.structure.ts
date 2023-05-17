const structureExtension = {
    // TODO: 为建筑基类添加拓展

    /**
     * 建筑运作
     */
    work(): void {
    },

    /**
     * 建筑建造完成时被调用
     */
    onBuildComplete(): void {
    },

}

import { mountLink } from './mount.link'
import { mountStorage } from './mount.storage'
export function mountStructure() {
    // 将拓展签入 Structure 原型 function mountLink()
    _.assign(Structure.prototype, structureExtension)
    mountLink()
    mountStorage()

    // 其他更多建筑拓展...
}

