import { serverCancelOldAjax } from '../../request'

export type FinishedTrade = {
  orderId: number
  ownerId: number
  customerId: number
  commodityId: number
  fail: boolean
  createTime: number
  remark: string
}

export const getFinishedTrade = (orderId: number) =>
  serverCancelOldAjax<FinishedTrade>(`/trade/${orderId}`)
