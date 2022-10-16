import { ChatMessage } from '../message'
import DatabaseManager from '../index'
import { ServerUser } from '../user'

export type LastMessageExactly = ChatMessage & ServerUser

/**
 * 标记消息已读
 * @param messageId 消息id
 */
export const markMessageRead = (messageId: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql(
      'UPDATE last_message SET confirmed = 1 WHERE username = ?',
      messageId
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
      valuesStr += `(${owner},${msg.messageId},${confirm})`
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
 */
export const queryLastMessage = () =>
  new Promise<ChatMessage[]>(resolve => {
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
 * @param username 哪个用户的消息
 */
export const deleteLastMessage = (username: number) =>
  new Promise(resolve => {
    DatabaseManager.executeSql('DELETE FROM last_message WHERE username = ?', [
      username,
    ]).then(resolve)
  })
