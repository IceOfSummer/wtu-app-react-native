export interface ResponseTemplate<D = undefined> {
  code: number
  message: string
  data: D
}

export type EsCommodity = {
  id: number
  name: string
  createTime: number
  price: number
  image: string
  tradeLocation: string
}

export enum CommodityStatus {
  STATUS_ACTIVE,
  STATUS_TRADING,
  STATUS_DONE,
}
export type Commodity = {
  commodityId: number
  ownerId: number
  name: string
  description: string
  createTime: string
  price: number
  status: CommodityStatus
  tradeLocation: string
  previewImage: string
  /**
   * 需要单独使用JSON进行二次解析
   */
  images: string
}
