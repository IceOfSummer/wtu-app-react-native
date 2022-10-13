import { SliceCaseReducers } from '@reduxjs/toolkit'
import { ChatMessage } from '../../sqlite/message'

/**
 * 消息状态, 结构如下:
 * {
 *    '聊天对象': [...消息内容]
 * }
 *
 * 每次只加载当前登录用户的消息内容
 */
export interface MessageState {
  /**
   * 在聊天界面上保存的最后聊天记录，可手动删除
   */
  messageLabels: MessageLabel
  /**
   * 用户的所有聊天记录
   */
  messages: MessageRecord
}

/**
 *  * 消息状态, 结构如下:
 * {
 *    '聊天对象': [...消息内容]
 * }
 */
export type MessageRecord = Record<number, ChatMessage[] | undefined>

export type MessageLabel = ChatMessage[]

export type BaseMessageRecord = {
  messages: MessageRecord
  messageLabels: MessageLabel
}

export interface MessageReducers extends SliceCaseReducers<MessageState> {}
