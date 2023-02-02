import { SqliteMessage } from '../message'
import DatabaseManager, { EMPTY_RESULT_SET } from '../index'
import { generateInsertArgument } from '../../utils/SqlUtils'

export type LastMessageQueryType = SqliteMessage & { unreadCount: number }

/**
 * 标记消息已读
 * @param uid 和谁的消息
 */
export const markMessageRead = (uid: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'UPDATE last_message SET unreadCount = 0 WHERE uid = ?',
      uid
    ).then(resolve)
  })

export const markMessageUnread = (uid: number) =>
  DatabaseManager.executeSql(
    'UPDATE last_message SET unreadCount = 1 WHERE uid = ?',
    uid
  )
/**
 * 插入last_message
 * @param confirm 是否为未读消息
 * @param message 消息
 */
export const insertLastMessage = (
  message: SqliteMessage,
  confirm: boolean | (1 | 0)
) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'REPLACE INTO last_message(uid, messageId, unreadCount) VALUES (?, ?, ?) ON CONFLICT(uid) DO UPDATE SET messageId = excluded.messageId, unreadCount = unreadCount + excluded.unreadCount',
      message.uid,
      message.messageId,
      confirm ? 0 : 1
    ).then(resolve)
  })

/**
 * 插入多条last_message, 默认这些消息都是未读的.
 * @param messages 多条消息，请确保按照uid升序排序
 */
export const insertMultiLastMessage = (messages: SqliteMessage[]) => {
  if (messages.length === 0) {
    return Promise.resolve([EMPTY_RESULT_SET])
  }
  const argument = generateInsertArgument(
    'last_message',
    '(uid,messageId,unreadCount)',
    messages,
    entity => [entity.uid, entity.messageId, 1]
  )
  argument.statement +=
    ' ON CONFLICT(uid) DO UPDATE SET messageId = excluded.messageId, unreadCount = unreadCount + excluded.unreadCount'
  return DatabaseManager.executeSql(argument.statement, ...argument.args)
}

/**
 * 查询用户聊天面板的消息
 */
export const queryLastMessage = () =>
  new Promise<LastMessageQueryType[]>(resolve => {
    DatabaseManager.executeSql(
      `SELECT lm.unreadCount as confirmed, m.* FROM last_message lm
                       JOIN message m USING(messageId)`
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

export const markAllMessageRead = () => {
  return DatabaseManager.executeSql(
    'UPDATE last_message SET unreadCount = 0 WHERE unreadCount > 0'
  )
}
