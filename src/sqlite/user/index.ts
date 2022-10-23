import DatabaseManager from '../index'
import { UserInfoView } from '../../api/server/user'

// const TABLE_NAME = 'user'

export type ServerUser = UserInfoView

/**
 * 插入一个用户
 * @param user
 */
export const insertOrUpdateUser = (user: ServerUser) => {
  return DatabaseManager.executeSql(
    'REPLACE INTO user VALUES(?, ?, ?, ?, ?)',
    user.uid,
    user.nickname,
    user.name,
    user.bedroom,
    user.credit
  )
}

export const insertOrUpdateMultiUsers = (user: ServerUser[]) => {
  let sql = ''
  user.forEach(value => {
    sql += getInlineSql(value) + ','
  })
  sql = sql.replace(/,$/, '')
  return DatabaseManager.executeSql('REPLACE INTO user VALUES ' + sql)
}

function getInlineSql(user: ServerUser): string {
  return `(${user.uid},${preventNull(user.nickname)},${preventNull(
    user.name
  )},${preventNull(user.bedroom)},${user.credit})`
}

function preventNull(val?: string): string {
  return val ? `'${val}'` : 'NULL'
}

/**
 * 获取用户信息
 * @param uid uid
 */
export const loadMultiUserInfo = async (
  uid: number[]
): Promise<ServerUser[]> => {
  if (uid.length === 0) {
    return []
  }
  let inSql = '('
  uid.forEach(value => {
    inSql += `${value},`
  })
  inSql = inSql.replace(/,$/, ')')
  const set = await DatabaseManager.executeSql(
    `SELECT * FROM user WHERE uid IN ${inSql}`
  )
  return set[0].rows.raw()
}
