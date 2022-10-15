import DatabaseManager from '../index'

// const TABLE_NAME = 'user'

export type ServerUser = {
  uid: number
  nickname: string
}

/**
 * 插入一个用户
 * @param user
 */
export const insertUser = (user: ServerUser) => {
  return DatabaseManager.executeSql(
    'REPLACE INTO user VALUES(?, ?, ?)',
    user.uid,
    user.nickname
  )
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
  console.log(inSql)
  const set = await DatabaseManager.executeSql(
    `SELECT * FROM user WHERE uid IN ${inSql}`
  )
  return set[0].rows.raw()
}
