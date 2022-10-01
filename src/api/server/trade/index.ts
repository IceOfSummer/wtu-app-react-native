import { serverNoRepeatAjax } from '../../request'

export type TradingInfo = {
  orderId: number
  commodityId: number
  createTime: number
  remark: string
  ownerId: number
  name: string
  price: number
  previewImage: string
  tradeLocation: string
}

export const getTradingRecord = (page = 0, size = 5) =>
  serverNoRepeatAjax<TradingInfo[]>('/trade/trading/record', {
    p: page,
    s: size,
  })
