import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
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
   * 当前聊天面板正在聊的消息, 当发送或者接收时，将消息存入该数组做临时缓存，避免查询数据库
   */
  currentTalkMessages: Array<ChatMessage>
}

/**
 * 消息面板
 */
export type MessageLabel = Record<number, ChatMessage | undefined>

export interface MessageReducers extends SliceCaseReducers<MessageState> {
  /**
   * 插入单条消息
   */
  insertSingleMessage: CaseReducer<MessageState, PayloadAction<ChatMessage>>
  /**
   * 移除消息面板的消息
   * 只需传入对应的用户名即可
   */
  removeMessagePanel: CaseReducer<MessageState, PayloadAction<number>>
  /**
   * 插入当前正在聊天的消息
   */
  insertCurrentTalkMessage: CaseReducer<
    MessageState,
    PayloadAction<ChatMessage>
  >
  /**
   * 清空当前正在聊天的消息
   */
  resetCurrentTalkMessage: CaseReducer<MessageState, PayloadAction<void>>
}
