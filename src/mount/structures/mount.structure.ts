const structureExtension = {
    // TODO: 为建筑基类添加拓展
    work():void {
    },
    onBuildComplete():void {
    },
    
}

import {mountLink} from './mount.link'
export function mountStructure() {
    // 将拓展签入 Structure 原型 function mountLink()
    _.assign(Structure.prototype, structureExtension)
    mountLink()

    // 其他更多建筑拓展...
}

