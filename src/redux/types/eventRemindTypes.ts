import { EventRemindSchema } from '../../sqlite/event_remind'
import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { EventRemindType } from '../../api/server/event_remind'

export interface EventRemindState {
  /**
   * 未读消息数量
   */
  sumUnreadCount: number
  /**
   * 未读的点赞消息数量
   */
  likeMessageCount: number
  /**
   * 未读的回复消息数量
   */
  replyMessageCount: number
  /**
   * 未读的系统消息数量
   */
  systemMessageCount: number
  /**
   * 未读点赞消息
   */
  likeReminds: EventRemindSchema[]
  /**
   * 未读回复消息
   */
  replyReminds: EventRemindSchema[]
  /**
   * 未读系统消息
   */
  sysReminds: EventRemindSchema[]
}

type Reducer<T = void> = CaseReducer<EventRemindState, PayloadAction<T>>

type RemoveRemindArgs = {
  id: number
  type: EventRemindType
}

export interface EventRemindReducers
  extends SliceCaseReducers<EventRemindState> {
  /**
   * 保存消息提醒
   */
  saveUnreadReminds: Reducer<EventRemindSchema[]>
  /**
   * 删除(标记已读，没有真的删除)消息提醒
   */
  removeRemind: Reducer<RemoveRemindArgs>
  /**
   * 清除所有消息
   */
  clearAllRemind: Reducer
  /**
   * 清除未读点赞消息
   */
  clearLikeRemind: Reducer
  /**
   * 清除未读回复
   */
  clearReplyRemind: Reducer
  /**
   * 清除未读系统消息
   */
  clearSysMsgRemind: Reducer
}
