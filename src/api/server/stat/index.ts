import { serverNoRepeatAjax } from '../../request'

export type TradeStat = {
  receiveCount: number
  deliveryCount: number
}

export const getTradeStat = () => serverNoRepeatAjax<TradeStat>('/stat/info')
