import { serverNoRepeatAjax } from '../../request'

export type CombinedEventRemind = {
  id: number
  sourceId: number
  sourceType: EventRemindType
  sourceContent?: string
  createTime: number
  count?: number
  remindTitle: string
  senderIds: number[]
  targetContent: string
}

export enum EventRemindType {
  LIKE_COMMENT,
  LIKE_POST,
  REPLY_POST,
  REPLY_SUB,
}

export const queryEventRemind = () =>
  serverNoRepeatAjax<CombinedEventRemind[]>('/remind/query')

export const queryUnreadTipCount = () =>
  serverNoRepeatAjax<number>('/remind/count')

export const markAllRead = () =>
  serverNoRepeatAjax('/remind/read', undefined, 'POST')
