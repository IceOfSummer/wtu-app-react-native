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
