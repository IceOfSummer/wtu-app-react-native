import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { ChatMessage } from '../../sqlite/message'
import { ServerUser } from '../../sqlite/user'

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
  /**
   * 相关用户
   */
  relatedUser: RelatedUser
}

export type RelatedUser = Record<number, ServerUser>

/**
 *  * 消息状态, 结构如下:
 * {
 *    '聊天对象': [...消息内容]
 * }
 */
export type MessageRecord = Record<number, ChatMessage[] | undefined>

/**
 * 消息面板
 */
export type MessageLabel = Array<ChatMessage>

export interface MessageReducers extends SliceCaseReducers<MessageState> {
  /**
   * 插入单条消息
   */
  insertSingleMessage: CaseReducer<MessageState, PayloadAction<ChatMessage>>
}
