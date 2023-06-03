// /**
//  * @todo
//  */


// import baseRoles from './basic'
// import advancedRoles from './advanced'


// const creepWork: CreepWork = {
//     ...baseRoles,
//     ...advancedRoles,
// }
// /**
//  * 导出所有的角色
//  */
// export default creepWork

import {basicRoles} from './role.basic'
import {advancedRoles} from './role.advanced'

export const roles: { [key: string]: FuncDict } = {
    ...basicRoles
    ,...advancedRoles
}
