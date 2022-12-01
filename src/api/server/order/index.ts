import { serverNoRepeatAjax } from '../../request'
import { appendCdnPrefix } from '../../../utils/CdnUtil'

export type OrderDetail = {
  orderId: number
  commodityId: number
  createTime: number
  remark: string
  name: string
  price: number
  tradeLocation: string
  status: OrderStatus
  type: OrderType
  count: number
  previewImage: string
  ownerId: number
}

export enum OrderStatus {
  TRADING,
  DONE,
  FAIL,
}

export enum OrderType {
  BUY,
  SELL,
}

/**
 * 查询用户出售记录
 */
export const getSoldOrderSimply = (userId: number, page = 0) =>
  serverNoRepeatAjax<OrderDetail[]>('/order/sold', {
    i: userId,
    p: page,
    s: 5,
  }).then(result => {
    result.data.forEach(value => {
      value.previewImage = appendCdnPrefix(value.previewImage)
    })
    return result
  })

export const getPendingReceiveOrder = (page: number = 0, size: number = 20) =>
  serverNoRepeatAjax<OrderDetail[]>('/order/pending/receive', {
    p: page,
    s: size,
  }).then(result => {
    result.data.forEach(value => {
      value.previewImage = appendCdnPrefix(value.previewImage)
      value.type = OrderType.BUY
    })
    return result
  })

export const getPendingDeliveryOrder = (page: number = 0, size: number = 20) =>
  serverNoRepeatAjax<OrderDetail[]>('/order/pending/delivery', {
    p: page,
    s: size,
  }).then(result => {
    result.data.forEach(value => {
      value.previewImage = appendCdnPrefix(value.previewImage)
      value.type = OrderType.SELL
    })
    return result
  })

export const getAllOrder = (page: number, size: number = 6) =>
  serverNoRepeatAjax<OrderDetail[]>('/order/all', { p: page, s: size }).then(
    result => {
      result.data.forEach(value => {
        value.previewImage = appendCdnPrefix(value.previewImage)
      })
      return result
    }
  )

/**
 * 标记交易成功
 */
export const markTradeDone = (
  orderId: number,
  sellerId: number,
  remark?: string
) =>
  serverNoRepeatAjax(
    `/order/${orderId}/done`,
    { s: sellerId, r: remark },
    'POST'
  )

/**
 * 取消订单
 */
export const cancelTrade = (orderId: number, remark?: string) =>
  serverNoRepeatAjax(`/order/${orderId}/cancel`, { r: remark }, 'POST')
