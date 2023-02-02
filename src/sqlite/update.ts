/**
 * 用于管理数据库的升级/初始化
 */
import SQLite, {
  SQLiteDatabase,
  Transaction,
} from 'react-native-sqlite-storage'
import { getLogger } from '../utils/LoggerUtils'

const logger = getLogger('/src/sqlite/update')
/**
 * 当前数据库的最新版本号
 */
const LATEST_VERSION = 5
/**
 * 用于保存SQL升级片段.
 * <p>
 * 例如{@link UPDATE_SQL}<a href="">[2]</a>代表当前数据库版本为2,时，升级到版本3时所需要运行的sql
 */
const UPDATE_SQL: Array<string> = []

/**
 * 从零初始化(即第一次运行)数据库所需要运行的sql
 */
const INITIAL_DB_SQL = `
CREATE TABLE IF NOT EXISTS message(
    uid INTEGER NOT NULL,
    messageId INTEGER,
    content CHAR(500) NOT NULL,
    createTime INT NOT NULL,
    type INT NOT NULL,
    PRIMARY KEY(uid, messageId)
);
CREATE TABLE IF NOT EXISTS last_message(
    uid INT PRIMARY KEY NOT NULL,
    messageId INT NOT NULL,
    unreadCount INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS app_metadata (
    name CHAR(10) PRIMARY KEY,
    value CHAR(3000) NOT NULL 
);
INSERT INTO app_metadata VALUES ('version', '${LATEST_VERSION}');
CREATE TABLE event_remind(
    id INT PRIMARY KEY NOT NULL,
    count INT,
    remindTitle CHAR(30) NOT NULL,
    sourceId INT NOT NULL,
    sourceType INT NOT NULL,
    sourceContent CHAR(30),
    senderIds CHAR(30) NOT NULL ,
    createTime INT NOT NULL,
    targetContent CHAR(30) NOT NULL,
    abstractType INT NOT NULL
);
CREATE INDEX event_remind_type_index ON event_remind(abstractType);
`

function transitionInvoke(
  sqlArray: string[],
  current: number,
  tx: Transaction
) {
  if (current === sqlArray.length) {
    return
  }
  const currentSql = sqlArray[current].trim()
  if (currentSql.length === 0) {
    transitionInvoke(sqlArray, current + 1, tx)
    return
  }
  tx.executeSql(
    currentSql,
    undefined,
    ntx => {
      transitionInvoke(sqlArray, current + 1, ntx)
    },
    (t, error) => {
      logger.error(
        'update database failed: ' + error + '. current sql: ' + currentSql
      )
    }
  )
}

/**
 * 解析并运行多行sql
 * @param db 数据库连接
 * @param sqlStr sql字符串
 * @private
 */
function parseAndRunMultiSql(db: SQLiteDatabase, sqlStr: string) {
  return new Promise<void>((resolve, reject) => {
    const sqlArr = sqlStr.split(';')
    db.transaction(
      tx => {
        transitionInvoke(sqlArr, 0, tx)
      },
      error => {
        reject(error)
      },
      () => {
        resolve()
      }
    )
  })
}

/**
 * 升级数据库结构
 * @param connection 数据库连接
 * @param currentVersion 当前版本，若为空，则会直接运行最新版本的SQL来初始化数据库
 */
export const doUpdate = async (
  connection: SQLite.SQLiteDatabase,
  currentVersion?: number
) => {
  logger.info('checking current database version code: ' + currentVersion)
  if (!currentVersion) {
    // 直接使用最新版
    return await parseAndRunMultiSql(connection, INITIAL_DB_SQL)
  }
  if (currentVersion === LATEST_VERSION) {
    logger.info('current database version is the latest')
    return
  }
  while (currentVersion < LATEST_VERSION) {
    logger.info(
      `updating database version from ${currentVersion} to ${
        currentVersion + 1
      }`
    )
    if (!UPDATE_SQL[currentVersion]) {
      throw new Error(
        '当前版本的APP版本太低，无法升级数据库，请安装新版本的APP'
      )
    }
    try {
      await parseAndRunMultiSql(connection, UPDATE_SQL[currentVersion++])
      logger.info('update success!')
    } catch (e) {
      throw e
    }
  }
}

UPDATE_SQL[3] = `
DROP TABLE IF EXISTS message;
CREATE TABLE IF NOT EXISTS message(
    uid INTEGER NOT NULL,
    messageId INTEGER,
    content CHAR(500) NOT NULL,
    createTime INT NOT NULL,
    type INT NOT NULL,
    PRIMARY KEY(uid, messageId)
);
UPDATE app_metadata SET value = '4' WHERE name = 'version';
`

/**
 * 从v4升级到v5
 * <p>
 * 该升级用于在消息面板显示具体的未读数量
 */
UPDATE_SQL[4] = `
DROP TABLE IF EXISTS last_message_dg_tmp;
create table last_message_dg_tmp
(
    uid         INT not null primary key,
    messageId   INT not null,
    unreadCount INT default 0
);
insert into last_message_dg_tmp(uid, messageId, unreadCount)
select uid, messageId, confirmed
from last_message;

drop table last_message;

alter table last_message_dg_tmp
    rename to last_message;
UPDATE app_metadata SET value = '5' WHERE name = 'version';
`
