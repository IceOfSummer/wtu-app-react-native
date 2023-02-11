/**
 * APP所有用户(包括匿名)共用的数据. 仅保存key-value数据
 */
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage-api30'
import { getLogger } from '../../utils/LoggerUtils'
import AppEvents from '../../AppEvents'

const logger = getLogger('/sqlite/public_data')
const INITIAL_SQL = `
CREATE TABLE IF NOT EXISTS public_data(
  name CHAR(50) PRIMARY KEY,
  value CHAR(400)
);
`

AppEvents.subscribe('onAppLaunch', () => {
  SQLite.openDatabase({ name: 'publicDb', location: 'Shared' })
    .then(r => {
      PublicData.INSTANCE = new PublicData(r)
      r.executeSql(INITIAL_SQL).catch(e => {
        logger.error('init database failed: ' + e.message)
      })
    })
    .catch(e => {
      logger.error('load database failed: ' + e.message)
    })
})

export default class PublicData {
  private _connection?: SQLiteDatabase

  constructor(connection: SQLiteDatabase) {
    this._connection = connection
  }

  private static _INSTANCE: PublicData

  set connection(value: SQLiteDatabase) {
    this._connection = value
  }

  static set INSTANCE(value: PublicData) {
    this._INSTANCE = value
  }

  public static async get(key: string): Promise<string | undefined> {
    const connection = PublicData._INSTANCE._connection
    if (connection) {
      const item = (
        await connection.executeSql(
          'SELECT value FROM public_data WHERE name = ?',
          [key]
        )
      )[0].rows.item(0)
      if (item && item.value.length > 0) {
        return item.value
      }
      return undefined
    } else {
      logger.warn('the connection is undefined!')
    }
  }

  public static async set(key: string, value?: string) {
    const connection = PublicData._INSTANCE._connection
    if (connection) {
      await connection.executeSql('REPLACE INTO public_data VALUES (?,?)', [
        key,
        value,
      ])
    } else {
      logger.warn('the connection is undefined!')
    }
  }
}
