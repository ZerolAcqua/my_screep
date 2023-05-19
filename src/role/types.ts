type FuncDict = { [key: string]: Function }

interface CreepMemory {
    /**
     * 该 creep 的角色
     */
    role: string

    /**
     * 该 creep 是否准备就绪
     */
    ready: boolean

    /**
     * 该 creep 是否执行任务
     */
    working: boolean
}

// -- TODO: 角色的类型重构 --
