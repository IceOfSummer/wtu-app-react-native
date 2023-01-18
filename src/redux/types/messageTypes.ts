import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { SqliteMessage } from '../../sqlite/message'
import { LastMessageQueryType } from '../../sqlite/last_message'

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
   * <p>
   * <b>该数组不一定按照messageId升序排序，在消息漏掉进行同步后，会打破其有序性!</b>，但之后仍然会按照id升序，直到漏掉了消息
   * <pre>
   * 大致的样子为: 10 11 12 15 13 14 16 17 18 ...
   *                       ↑        ↑
   *                   漏掉消息了 消息同步完毕
   *                    开始同步  继续正常递增
   *
   */
  onlineMessages: Array<SqliteMessage>
  /**
   * 未读消息总数
   */
  unreadCount: number
}

/**
 * 消息面板
 */
export type MessageLabel = Record<number, LastMessageQueryType | undefined>

export interface MessageReducers extends SliceCaseReducers<MessageState> {
  /**
   * 插入单条消息
   */
  insertSingleMessage: CaseReducer<
    MessageState,
    PayloadAction<LastMessageQueryType>
  >
  /**
   * 移除消息面板的消息
   * 只需传入对应的用户名即可
   */
  removeMessagePanel: CaseReducer<MessageState, PayloadAction<number>>
  /**
   * 插入当前正在聊天的消息
   */
  insertOnlineMessage: CaseReducer<
    MessageState,
    PayloadAction<SqliteMessage[] | SqliteMessage>
  >
  /**
   * 同步离线消息，会自动将confirmed置为0
   */
  insertOfflineMessage: CaseReducer<
    MessageState,
    PayloadAction<SqliteMessage[]>
  >
  /**
   * 清空当前正在聊天的消息
   */
  resetCurrentTalkMessage: CaseReducer<MessageState, PayloadAction<void>>
  /**
   * 修改消息读取确认状态
   */
  modifyReadStatus: CaseReducer<
    MessageState,
    PayloadAction<{ uid: number; confirmed: 1 | 0 }>
  >
}
