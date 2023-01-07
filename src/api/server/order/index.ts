import { serverNoRepeatAjax } from '../../request'
import { appendCdnPrefix } from '../../../utils/CdnUtil'

export type OrderPreview = {
  tradeUid: number
  tradeName: string
  orderId: number
  /**
   * 商品名称
   */
  name: string
  createTime: number
  previewImage: string
  type: OrderType
  price: number
  count: number
  status: OrderStatus
}

export type OrderDetail = {
  commodityId: number
  commodityName: string
  count: number
  price: number
  tradeLocation: string
  status: OrderStatus
  type: OrderType
  remark: string
  tradeUid: number
  tradeName: string
  createTime: number
  finishedTime: number
  finishedRemark: string
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
  serverNoRepeatAjax<OrderPreview[]>('/order/sold', {
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
  serverNoRepeatAjax<OrderPreview[]>('/order/pending/receive', {
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
  serverNoRepeatAjax<OrderPreview[]>('/order/pending/delivery', {
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
  serverNoRepeatAjax<OrderPreview[]>('/order/all', { p: page, s: size }).then(
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
export const markTradeDone = (orderId: number, remark?: string) =>
  serverNoRepeatAjax(`/order/${orderId}/done`, { r: remark }, 'POST')

/**
 * 取消订单
 */
export const cancelTrade = (orderId: number, remark?: string) =>
  serverNoRepeatAjax(`/order/${orderId}/cancel`, { r: remark }, 'POST')

/**
 * 查询订单详细信息
 */
export const queryOrderDetail = (orderId: number) =>
  serverNoRepeatAjax<OrderDetail>(`/order/${orderId}/detail`)
