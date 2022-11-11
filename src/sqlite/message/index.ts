import DatabaseManager from '../index'

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
 * @param page 第几页
 */
export const queryMessage = (uid: number, page = 0): Promise<SqliteMessage[]> =>
  DatabaseManager.executeSql(
    'SELECT uid, content, createTime, type FROM message WHERE uid = ? ORDER BY createTime DESC LIMIT ?, ?',
    uid,
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
