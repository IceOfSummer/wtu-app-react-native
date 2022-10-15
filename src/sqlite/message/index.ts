import DatabaseManager from '../index'

const TABLE_COLUMNS = 'username, sendTo, content, createTime, type'
const QUERY_COLUMNS = 'sendTo, content, createTime, type'

export type ChatMessage = {
  messageId: number
  sendTo: number
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
 * 获取用户的消息
 */
export const queryMessage = () =>
  new Promise<ChatMessage[]>(resolve => {
    DatabaseManager.executeSql(`SELECT ${QUERY_COLUMNS} FROM message`).then(
      result => {
        resolve(result[0].rows.raw())
      }
    )
  })

/**
 * 插入一条消息
 * @param username 谁的消息
 * @param message 消息内容
 * @return 返回新插入的消息id
 */
export const insertMessage = (username: number, message: ParamMessage) =>
  new Promise<ChatMessage>(resolve => {
    DatabaseManager.executeSql(
      `INSERT INTO message(${TABLE_COLUMNS}) VALUES (${username}, ${message.sendTo}, '${message.content}', ${message.createTime}, ${message.type})`
    ).then(set => {
      // 插入最后聊天
      const re: ChatMessage = {
        messageId: set[0].insertId,
        ...message,
      }
      resolve(re)
    })
  })
