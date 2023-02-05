/**
 * APP所有用户(包括匿名)共用的数据. 仅保存key-value数据
 */
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/sqlite/public_data')

const INITIAL_SQL = `
CREATE TABLE IF NOT EXISTS data(
    NAME CHAR(50) PRIMARY KEY,
    VALUE CHAR(400)
);
`

export default class PublicData {
  private _connection?: SQLiteDatabase

  private static readonly INSTANCE = new PublicData()

  static {
    SQLite.openDatabase({ name: 'publicDb', location: 'Shared' })
      .then(r => {
        PublicData.INSTANCE._connection = r
        r.executeSql(INITIAL_SQL).catch(e => {
          logger.error('init database failed: ' + e.message)
        })
      })
      .catch(e => {
        logger.error('load database failed: ' + e.message)
      })
  }

  set connection(value: SQLiteDatabase) {
    this._connection = value
  }

  public static async get(key: string): Promise<string | undefined> {
    const connection = PublicData.INSTANCE._connection
    if (connection) {
      return (
        await connection.executeSql('SELECT value FROM data WHERE name = ?', [
          key,
        ])
      )[0].rows.item(0).value
    } else {
      logger.warn('the connection is undefined!')
    }
  }

  public static async set(key: string, value?: string) {
    const connection = PublicData.INSTANCE._connection
    if (connection) {
      await connection.executeSql('REPLACE INTO data VALUES (?,?)', [
        key,
        value,
      ])
    } else {
      logger.warn('the connection is undefined!')
    }
  }
}
