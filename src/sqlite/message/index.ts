import DatabaseManager from '../index'

export type ChatMessage = {
  messageId: number
  /**
   * 和谁相关的消息
   */
  uid: number
  content: string
  createTime: number
  type: MessageType
}

/**
 * 不提供id
 */
export type ParamMessage = Omit<ChatMessage, 'messageId'>

export enum MessageType {
  SEND,
  RECEIVE,
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
export const queryMessage = (uid: number, page = 0): Promise<ChatMessage[]> =>
  DatabaseManager.executeSql(
    'SELECT uid, content, createTime, type FROM message WHERE uid = ? ORDER BY createTime LIMIT ?, ?',
    uid,
    page * 10,
    PAGE_SIZE
  ).then(result => {
    return Promise.resolve(result[0].rows.raw())
  })

/**
 * 插入一条消息
 * @param uid 谁的消息
 * @param message 消息内容
 * @return 返回新插入的消息id
 */
export const insertMessage = (uid: number, message: ParamMessage) =>
  new Promise<ChatMessage>(resolve => {
    DatabaseManager.executeSql(
      'INSERT INTO message(uid, content, createTime, type) VALUES (?,?,?,?)',
      uid,
      message.content,
      message.createTime,
      message.type
    ).then(set => {
      // 插入最后聊天
      const re: ChatMessage = {
        messageId: set[0].insertId,
        ...message,
      }
      resolve(re)
    })
  })
