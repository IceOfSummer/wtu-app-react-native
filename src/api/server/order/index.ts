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
  buyerRemark: string
  sellerRemark: string
}
export enum OrderStatus {
  TRADING = 0,
  BUYER_CONFIRMED = 1,
  SELLER_CONFIRMED = 2,
  BUYER_CANCELED = 3,
  SELLER_CANCELED = 4,
  DONE = 100,
  CANCELED_BY_SELLER = 101,
  CANCELED_BY_BUYER = 102,
}
type StatusString = {
  name: string
  color: string
}

export const orderStatusToString = (orderStatus: OrderStatus): StatusString => {
  switch (orderStatus) {
    case OrderStatus.TRADING:
      return {
        name: '交易中',
        color: global.colors.success_color,
      }
    case OrderStatus.BUYER_CONFIRMED:
      return {
        name: '等待卖家确认',
        color: global.colors.success_color,
      }
    case OrderStatus.SELLER_CONFIRMED:
      return {
        name: '等待买家确认',
        color: global.colors.success_color,
      }
    case OrderStatus.BUYER_CANCELED:
      return {
        name: '买家申请取消订单',
        color: global.colors.warning_color,
      }
    case OrderStatus.SELLER_CANCELED:
      return {
        name: '卖家申请取消订单',
        color: global.colors.warning_color,
      }
    case OrderStatus.DONE:
      return {
        name: '已完成',
        color: global.colors.primaryColor,
      }
    case OrderStatus.CANCELED_BY_BUYER:
      return {
        name: '买家取消订单',
        color: global.colors.error_color,
      }
    case OrderStatus.CANCELED_BY_SELLER:
      return {
        name: '卖家取消订单',
        color: global.colors.error_color,
      }
    default:
      return {
        name: '',
        color: '',
      }
  }
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
export const markTradeDone = (
  orderId: number,
  previousStatus: number,
  isSeller?: boolean,
  remark?: string
) =>
  serverNoRepeatAjax(
    `/order/${orderId}/done`,
    { r: remark, s: isSeller ? '1' : '0', ps: previousStatus },
    'POST'
  )

/**
 * 取消订单
 */
export const cancelTrade = (
  orderId: number,
  previousStatus: number,
  isSeller?: boolean,
  remark?: string
) =>
  serverNoRepeatAjax(
    `/order/${orderId}/cancel`,
    { r: remark, s: isSeller ? '1' : '0', ps: previousStatus },
    'POST'
  )

/**
 * 查询订单详细信息
 */
export const queryOrderDetail = (orderId: number) =>
  serverNoRepeatAjax<OrderDetail>(`/order/${orderId}/detail`)
