import { serverNoRepeatAjax } from '../../request'

export type TradeStat = {
  income: number
  expenditure: number
  sumOrder: number
  successOrder: number
}

export const getTradeStat = () => serverNoRepeatAjax<TradeStat>('/stat/info')
