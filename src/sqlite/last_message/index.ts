import { ChatMessage } from '../message'
import DatabaseManager from '../index'

/**
 * 标记消息已读
 * @param messageId 消息id
 */
export const markMessageRead = (messageId: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'UPDATE last_message SET confirmed = 1 WHERE messageId = ?',
      [messageId]
    ).then(resolve)
  })

/**
 * 插入last_message
 * @param owner 谁的消息
 * @param confirm 是否为未读消息
 * @param messages 消息
 */
export const insertLastMessage = (
  owner: number,
  confirm: 1 | 0,
  ...messages: ChatMessage[]
) =>
  new Promise(resolve => {
    let valuesStr = ''
    for (let i = 0, len = messages.length; i < len; i++) {
      const msg = messages[i]
      valuesStr += `(${msg.messageId},${owner},${confirm})`
      if (i < len - 1) {
        valuesStr += ','
      }
    }
    DatabaseManager.executeSql(
      `REPLACE INTO last_message VALUES ${valuesStr}`
    ).then(resolve)
  })

/**
 * 查询用户聊天面板的消息
 * @param username 用户
 */
export const queryLastMessage = (username: number) =>
  new Promise<ChatMessage[]>(resolve => {
    DatabaseManager.executeSql(
      `SELECT lm.confirmed as confirmed, m.* FROM last_message lm
                       JOIN message m USING(messageId)
                       WHERE lm.username = ?`,
      username
    ).then(result => {
      resolve(result[0].rows.raw())
    })
  })

/**
 * 删除聊天面板的消息
 * @param messageId 消息id
 */
export const deleteLastMessage = (messageId: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql('DELETE FROM last_message WHERE messageId = ?', [
      messageId,
    ]).then(resolve)
  })
