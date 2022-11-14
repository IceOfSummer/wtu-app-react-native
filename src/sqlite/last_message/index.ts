import { SqliteMessage } from '../message'
import DatabaseManager from '../index'
import { ServerUser } from '../user'

export type LastMessageExactly = LastMessageQueryType & ServerUser

export type LastMessageQueryType = SqliteMessage & { confirmed: number }

/**
 * 标记消息已读
 * @param uid 和谁的消息
 */
export const markMessageRead = (uid: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'UPDATE last_message SET confirmed = 1 WHERE uid = ?',
      uid
    ).then(resolve)
  })

/**
 * 插入last_message
 * @param confirm 是否为未读消息
 * @param message 消息
 */
export const insertLastMessage = (message: SqliteMessage, confirm: 1 | 0) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'REPLACE INTO last_message(uid, messageId, confirmed) VALUES (?, ?, ?)',
      message.uid,
      message.messageId,
      confirm
    ).then(resolve)
  })

/**
 * 插入多条last_message
 * @param messages 多条消息，请确保按照uid升序排序
 * @param confirm confirm
 */
export const insertMultiLastMessage = (
  messages: SqliteMessage[],
  confirm: 1 | 0
) => {
  let sql = 'REPLACE INTO last_message VALUES'
  for (let i = 0, len = messages.length; i < len; ++i) {
    const msg = messages[i]
    sql += `(${msg.uid}, ${msg.messageId}, ${confirm})`
    if (i < len - 1) {
      sql += ','
    }
  }
  return DatabaseManager.executeSql(sql)
}

/**
 * 查询用户聊天面板的消息
 */
export const queryLastMessage = () =>
  new Promise<LastMessageQueryType[]>(resolve => {
    DatabaseManager.executeSql(
      `SELECT lm.confirmed as confirmed, m.* FROM last_message lm
                       JOIN message m USING(messageId)`
    ).then(result => {
      resolve(result[0].rows.raw())
    })
  })

/**
 * 查询用户聊天面板的详细信息
 */
export const queryLastMessageExactly = () =>
  new Promise<Array<LastMessageExactly>>(resolve => {
    DatabaseManager.executeSql(
      `
                SELECT u.*, lm.confirmed as confirmed, m.* 
                FROM last_message lm, user u LEFT JOIN message m 
                ON m.messageId = lm.messageId
            `
    ).then(result => {
      resolve(result[0].rows.raw())
    })
  })

/**
 * 删除聊天面板的消息
 * @param uid 哪个用户的消息
 */
export const deleteLastMessage = (uid: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'DELETE FROM last_message WHERE uid = ?',
      uid
    ).then(resolve)
  })
