import DatabaseManager, { EMPTY_RESULT_SET } from '../index'

export type SqliteMessage = {
  messageId: number
  /**
   * 和谁相关的消息
   */
  uid: number
  content: string
  createTime: number
  type: MessageType
}

export enum MessageType {
  RECEIVE,
  SEND,
}

/**
 * 消息查询分页大小
 */
const PAGE_SIZE = 10

/**
 * 获取用户的消息
 * @param uid 和谁聊天
 * @param maxId 所查询消息的最大id(不包括)
 * @param page 第几页
 */
export const queryMessage = (
  uid: number,
  maxId: number,
  page = 0
): Promise<SqliteMessage[]> =>
  DatabaseManager.executeSql(
    'SELECT uid, content, createTime, type FROM message WHERE uid = ? AND messageId < ? ORDER BY createTime DESC LIMIT ?, ?',
    uid,
    maxId,
    page * 10,
    PAGE_SIZE
  ).then(result => {
    return Promise.resolve(result[0].rows.raw())
  })

/**
 * 插入一条消息
 * @param message 消息内容
 */
export const insertMessage = (message: SqliteMessage) =>
  DatabaseManager.executeSql(
    'INSERT INTO message(messageId, uid, content, createTime, type) VALUES (?,?,?,?,?)',
    message.messageId,
    message.uid,
    message.content,
    message.createTime,
    message.type
  )

/**
 * 插入多条消息
 * @param messages
 */
export const insertMultiplyMessage = (messages: SqliteMessage[]) => {
  if (messages.length === 0) {
    return Promise.resolve([EMPTY_RESULT_SET])
  }
  let sql =
    'INSERT INTO message(messageId, uid, content, createTime, type) VALUES'
  const args: Array<string | number> = []
  for (let i = 0, len = messages.length; i < len; i++) {
    const msg = messages[i]
    sql += '(?,?,?,?,?)'
    if (i < len - 1) {
      sql += ','
    }
    args.push(
      msg.messageId,
      msg.uid,
      msg.content ?? '',
      msg.createTime,
      msg.type
    )
  }
  return DatabaseManager.executeSql(sql, ...args)
}

/**
 * 获取当前最大的消息id
 */
export const getMaxMsgId = (): Promise<number> =>
  DatabaseManager.executeSql(
    'SELECT messageId FROM message ORDER BY messageId DESC LIMIT 1'
  ).then(value => {
    const item = value[0].rows.item(0)
    return item ? item.messageId : -1
  })
