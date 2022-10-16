import SQLite, {
  SQLiteDatabase,
  Transaction,
} from 'react-native-sqlite-storage'
import { getLogger } from '../utils/LoggerUtils'

const logger = getLogger('/src/sqlite')

/**
 * 数据库版本号，相关信息保存在metadata表中，若版本号不一致，则会调用{@link DatabaseManager.updateDatabase}
 */
const version = 1

const sql = `
DROP TABLE IF EXISTS message;
CREATE TABLE message(
    messageId INTEGER PRIMARY KEY AUTOINCREMENT,
    username INT NOT NULL,
    sendTo INT NOT NULL,
    content CHAR(500) NOT NULL,
    createTime INT NOT NULL,
    type INT NOT NULL
);
CREATE INDEX IF NOT EXISTS message_username_index ON message(username);

DROP TABLE IF EXISTS last_message;
CREATE TABLE last_message(
    messageId INTEGER PRIMARY KEY,
    username INT NOT NULL,
    confirmed TINYINT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS last_message_username_index ON last_message(username);

DROP TABLE IF EXISTS app_metadata;
CREATE TABLE app_metadata (
    name CHAR(10) PRIMARY KEY,
    value CHAR(50) NOT NULL 
);
INSERT INTO app_metadata VALUES ('version', '${version}');

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    uid INTEGER PRIMARY KEY NOT NULL ,
    avatar CHAR(100) NOT NULL,
    nickname CHAR(100) NOT NULL
)
`

class DatabaseManager {
  private constructor() {}

  private static _database: SQLiteDatabase

  private static _name: string

  static get namespace(): string {
    return this._name
  }

  /**
   * 加载一个数据库
   * @param uid 用户id
   */
  public static async loadDatabase(uid: number) {
    DatabaseManager._name = 'u' + uid
    logger.info('loading database: ' + DatabaseManager._name)
    if (DatabaseManager._database) {
      DatabaseManager._database.close().catch(e => {
        logger.error(
          `while trying to close database "${DatabaseManager._name}" fail`
        )
        logger.error(e)
      })
    }
    DatabaseManager._database = await DatabaseManager.openDatabase(
      DatabaseManager._name
    )
    logger.info('starting init database')
    await DatabaseManager.initDatabase()
    logger.info('init database over')
  }

  /**
   * 连接数据库
   * @param name 命名
   * @private
   */
  private static openDatabase(name: string) {
    return SQLite.openDatabase({
      name: name,
      location: 'Shared',
    })
  }

  /**
   * 初始化数据库，用来创建表
   * @private
   */
  private static async initDatabase() {
    return new Promise<void>(async (resolve, reject) => {
      const check = await DatabaseManager.executeSql(
        'SELECT * FROM sqlite_master WHERE tbl_name = ?',
        'app_metadata'
      )
      if (check[0].rows.length === 0) {
        logger.info('no local database exist, creating new tables')
        // 创建表
        await DatabaseManager.parseAndRunMultiSql(
          DatabaseManager._database,
          sql
        )
        resolve()
        return
      }
      logger.info('local database is found, checking version code')
      const set = await DatabaseManager.executeSql(
        'SELECT * FROM app_metadata WHERE name = ?',
        'version'
      )
      const versionMeta = set[0].rows.item(0) as MetadataType
      const gap = version - Number.parseInt(versionMeta.value, 10)
      if (gap === 1) {
        // 版本号差1才进行更新, 跨度太大不更新
        logger.info('database is old version, updating')
        DatabaseManager.updateDatabase()
        resolve()
        return
      } else if (gap > 1) {
        logger.error('current app version is too low, please reinstall app! ')
        reject(new Error('您当前APP版本过低，请重新下载最新版本'))
        return
      }
      logger.info('current local database is usable!')
      resolve()
    })
  }

  /**
   * 解析并运行多行sql
   * @param db 数据库连接
   * @param sqlStr sql字符串
   * @private
   */
  private static async parseAndRunMultiSql(db: SQLiteDatabase, sqlStr: string) {
    const sqlArr = sqlStr.split(';')
    for (let i = 0, len = sqlArr.length; i < len; i++) {
      const trimmedStr = sqlArr[i].trim()
      if (trimmedStr) {
        await db.executeSql(trimmedStr)
      }
    }
  }

  /**
   * 执行<b>事务</b>SQL
   */
  public static transaction(cb: (tx: Transaction) => void) {
    logger.debug('opened a transaction sql')
    if (DatabaseManager._database) {
      DatabaseManager._database.transaction(cb)
      return
    }
    DatabaseManager.openDatabase(DatabaseManager._name).then(db => {
      DatabaseManager._database = db
      db.transaction(cb)
    })
  }

  /**
   * 执行普通sql
   */
  public static executeSql(statement: string, ...args: any[]) {
    logger.debug(
      'SQL RUNNING\nSQL: ' + statement + '\nARGS: ' + args.toString()
    )
    if (DatabaseManager._database) {
      return DatabaseManager._database.executeSql(statement, args)
    }
    return DatabaseManager.openDatabase(DatabaseManager._name).then(db => {
      DatabaseManager._database = db
      return Promise.resolve(db.executeSql(statement, args))
    })
  }

  /**
   * 从上一个版本的数据库升级到新版本
   * @private
   */
  private static updateDatabase() {}
}

type MetadataType = {
  name: string
  value: string
}

export default DatabaseManager
