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

// 所有 creep 角色
type CreepRoleConstant = BaseRoleConstant | AdvancedRoleConstant | RemoteRoleConstant | WarRoleConstant

// 基础角色
type BaseRoleConstant =
    "harvester" |
    "upgrader" |
    "builder" |
    "repairer" |
    "carrier" |
    "digger"

// 高级角色
type AdvancedRoleConstant =
    "processor"

// 远程角色
type RemoteRoleConstant =
    'claimer' |
    'reserver' |
    'signer'

// 战斗角色
type WarRoleConstant =
    "soldier"