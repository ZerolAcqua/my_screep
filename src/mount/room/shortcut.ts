/**
 * Room 快捷访问
 * 
 * 提供对房间内资源的快捷访问方式，如：W1N1.nuker、W1N1.sources 等
 * 包括唯一型建筑（Nuker、Factory ...）和自然资源（Source、Mineral ...）
 */

export default class RoomShortcut extends Room {
    public factoryGetter(): StructureFactory {
        return getStructure<StructureFactory>(this, '_factory', 'factoryId')
    }

    public powerSpawnGetter(): StructurePowerSpawn {
        return getStructure<StructurePowerSpawn>(this, '_powerSpawn', 'powerSpawnId')
    }

    public nukerGetter(): StructureNuker {
        return getStructure<StructureNuker>(this, '_nuker', 'nukerId')
    }

    public observerGetter(): StructureObserver {
        return getStructure<StructureObserver>(this, '_observer', 'observerId')
    }

    public centerLinkGetter(): StructureLink {
        return getStructure<StructureLink>(this, '_centerLink', 'centerLinkId')
    }

    public extractorGetter(): StructureExtractor {
        return getStructure<StructureExtractor>(this, '_extractor', 'extractorId')
    }
}

/**
 * 获取并缓存建筑
 * 
 * @param room 目标房间
 * @param privateKey 建筑缓存在目标房间的键
 * @param memoryKey 建筑 id 在房间内存中对应的字段名
 * @returns 对应的建筑
 */
const getStructure = function<T>(room: Room, privateKey: string, memoryKey: string): T {
    if (room[privateKey]) return room[privateKey]

    // 内存中没有 id 就说明没有该建筑
    if (!room.memory[memoryKey]) return undefined
    
    // 从 id 获取建筑并缓存
    const target: T = Game.getObjectById(room.memory[memoryKey]) as T

    // 如果保存的 id 失效的话，就移除缓存
    if (!target) {
        delete room.memory[memoryKey]
        return undefined
    }

    // 否则就暂存对象并返回
    room[privateKey] = target
    return target
}