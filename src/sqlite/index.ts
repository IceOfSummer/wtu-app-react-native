import SQLite, {
  ResultSet,
  SQLiteDatabase,
} from 'react-native-sqlite-storage-api30'
import { getLogger } from '../utils/LoggerUtils'
import AppEvents from '../AppEvents'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doUpdate } from './update'

const logger = getLogger('/src/sqlite')

export const EMPTY_RESULT_SET: ResultSet = {
  rowsAffected: 0,
  insertId: 0,
  rows: {
    raw(): any[] {
      return []
    },
    item(): any {
      return undefined
    },
    length: 0,
  },
}

const LAST_OPEN_UID = 'LastOpenUid'

class DatabaseManager {
  private _database: SQLiteDatabase | undefined

  private readonly _namespace: string

  private static INSTANCE: DatabaseManager | undefined

  public constructor(namespace: string) {
    this._namespace = namespace
    logger.info('loading database: ' + this._namespace)
    DatabaseManager.openDatabase(this._namespace)
      .then(r => {
        logger.info('starting init database')
        DatabaseManager.initDatabase(r)
          .then(() => {
            this._database = r
            AppEvents.trigger('beforeDatabaseInitDone')
            AppEvents.trigger('appDatabaseCheckDone')
            AppEvents.trigger('onDatabaseInitDone')
          })
          .catch(e => {
            logger.error('init database failed: ' + e.message)
          })
      })
      .catch(e => {
        logger.error('open database failed: ' + e.message)
      })
  }

  public static isReady(): boolean {
    return this.INSTANCE?._database !== undefined
  }

  static get namespace(): string | undefined {
    return this.INSTANCE?._namespace
  }

  /**
   * 加载一个数据库
   * @param uid 用户id
   */
  public static async loadDatabase(uid?: number) {
    if (!uid) {
      uid = await this.getLastOpenUid()
    }
    if (!uid) {
      AppEvents.trigger('appDatabaseCheckDone')
      return
    }
    this.setLastOpenUid(uid)
    DatabaseManager.INSTANCE = new DatabaseManager('u' + uid)
  }

  public static setLastOpenUid(uid?: number) {
    if (uid) {
      AsyncStorage.setItem(LAST_OPEN_UID, uid.toString()).catch(e => {
        logger.error('setLastOpenUid failed: ' + e.message)
      })
    } else {
      AsyncStorage.removeItem(LAST_OPEN_UID).catch(e => {
        logger.error('setLastOpenUid failed: ' + e.message)
      })
    }
  }

  private static async getLastOpenUid(): Promise<number | undefined> {
    const uid = await AsyncStorage.getItem(LAST_OPEN_UID)
    return uid ? Number.parseInt(uid, 10) : undefined
  }

  public static async closeConnection(): Promise<void> {
    logger.info('closing connection...')
    if (DatabaseManager.INSTANCE) {
      await DatabaseManager.INSTANCE._database?.close()
      DatabaseManager.INSTANCE = undefined
      await DatabaseManager.setLastOpenUid(undefined)
      logger.info('close database success')
    } else {
      logger.warn('no instance found')
    }
  }

  /**
   * 连接数据库
   * @param name 命名
   * @private
   */
  private static openDatabase(name: string) {
    return SQLite.openDatabase({
      name: name,
    })
  }

  /**
   * 初始化数据库，用来创建表
   * @private
   */
  private static async initDatabase(connection: SQLiteDatabase) {
    const check = await connection.executeSql(
      'SELECT * FROM sqlite_master WHERE tbl_name = ?',
      ['app_metadata']
    )
    if (check[0].rows.length === 0) {
      logger.info('no local database exist, creating new tables')
      // 创建表
      await doUpdate(connection)
      return
    }
    logger.info('local database is found, checking version code')
    const set = await DatabaseManager.executeSql(
      'SELECT * FROM app_metadata WHERE name = ?',
      'version'
    )
    const versionMeta = set[0].rows.item(0) as MetadataType
    await doUpdate(connection, Number.parseInt(versionMeta.value, 10))
  }

  /**
   * 执行普通sql
   */
  public static executeSql(
    statement: string,
    ...args: (string | number | null | undefined)[]
  ) {
    logger.info(
      'SQL RUNNING\nSQL: ' + statement + '\nARGS: ' + args.toString?.()
    )
    return DatabaseManager.executeSqlWithoutLog(statement, args)
  }

  public static executeSqlWithoutLog(statement: string, args: any[]) {
    const instance = DatabaseManager.INSTANCE
    if (!instance) {
      logger.error('no instance exist, can not run sql: ' + statement)
      throw new Error('数据库加载失败')
    }
    if (instance._database) {
      return instance._database.executeSql(statement, args)
    }
    return DatabaseManager.openDatabase(instance._namespace).then(db => {
      if (DatabaseManager.INSTANCE) {
        DatabaseManager.INSTANCE._database = db
      }
      return Promise.resolve(db.executeSql(statement, args))
    })
  }
}

type MetadataType = {
  name: string
  value: string
}

export default DatabaseManager
