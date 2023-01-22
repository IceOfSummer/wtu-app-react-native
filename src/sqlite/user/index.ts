import { UserInfoQueryType } from '../../api/server/user'
import AppEvents from '../../AppEvents'
import { getLogger } from '../../utils/LoggerUtils'
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage'
import { generateInsertValues } from '../../utils/SqlUtils'

export type ServerUser = UserInfoQueryType

let instance: SQLiteDatabase | undefined

const logger = getLogger('/sqlite/user')

const DB_NAME = 'public_db'

const initSql = `
CREATE TABLE IF NOT EXISTS user (
    userId INTEGER PRIMARY KEY NOT NULL ,
    nickname CHAR(20),
    credit INT NOT NULL
);
`
AppEvents.subscribeOnce('onAppLaunch', async () => {
  try {
    instance = await SQLite.openDatabase({
      name: DB_NAME,
      location: 'Shared',
    })
    await instance.executeSql(initSql)
  } catch (e: any) {
    logger.error('init public database failed: ' + e.message)
  }
})

function ensureInstanceExist() {
  if (!instance) {
    throw new Error('公共数据库加载失败!')
  }
}

/**
 * 插入一个用户
 * @param user
 */
export const insertOrUpdateUser = (user: ServerUser) => {
  ensureInstanceExist()
  return instance!.executeSql('REPLACE INTO user VALUES(?, ?, ?)', [
    user.userId,
    user.nickname,
    user.credit,
  ])
}

export const insertOrUpdateMultiUsers = (user: ServerUser[]) => {
  if (user.length === 0) {
    return Promise.resolve()
  }
  ensureInstanceExist()
  const values = generateInsertValues(user, value => [
    value.userId,
    value.nickname,
    value.credit,
  ])
  return instance!.executeSql('REPLACE INTO user ' + values.sql, values.args)
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
  ensureInstanceExist()
  let inSql = '('
  uid.forEach(value => {
    inSql += `${value},`
  })
  inSql = inSql.replace(/,$/, ')')
  const set = await instance!.executeSql(
    `SELECT * FROM user WHERE userId IN ${inSql}`
  )
  return set[0].rows.raw()
}
