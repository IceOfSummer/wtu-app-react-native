import { serverNoRepeatAjax } from '../../request'

export type Order = {
  orderId: number
  commodityId: number
  name: string
  price: number
  previewImage: string
  ownerId: number
  customerId: number
  fail: boolean
  remark: string
  createTime: number
}

export type SimpleOrder = {
  orderId: number
  name: string
  price: number
  previewImage: string
  fail: boolean
  remark: string
  createTime: number
}

export const getSoldOrderSimply = (userId: number, page = 0) =>
  serverNoRepeatAjax<SimpleOrder[]>(`/order/${userId}/sold`, { p: page, s: 5 })
