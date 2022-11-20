import { Commodity, EsCommodity, ResponseTemplate } from '../types'
import { serverCancelOldAjax, serverNoRepeatAjax } from '../../request'

type PostCommodityType = Omit<
  Commodity,
  'commodityId' | 'ownerId' | 'createTime' | 'status'
>

/**
 * 创建一个商品
 * @param commodity
 */
export const createCommodity = (commodity: PostCommodityType) =>
  serverNoRepeatAjax('/commodity/create', commodity, 'POST')

export const searchCommodity = (searchContent: string, page = 0) =>
  serverCancelOldAjax<EsCommodity[]>('/commodity/search', {
    s: searchContent,
    p: page,
  })

export type ProcessedCommodity = Omit<Commodity, 'images'> & {
  images: string[]
}

export const getCommodityDetail = (commodityId: number) =>
  new Promise<ResponseTemplate<ProcessedCommodity | null>>(
    (resolve, reject) => {
      serverNoRepeatAjax<Commodity | undefined>('/commodity/query', {
        i: commodityId,
      })
        .then(resp => {
          const data = resp.data
          if (data) {
            data.images = JSON.parse(data.images)
          }
          // @ts-ignore
          resolve(resp)
        })
        .catch(reject)
    }
  )

export const lockCommodity = (commodityId: number, remark?: string) =>
  serverNoRepeatAjax('/commodity/lock', { c: commodityId, r: remark }, 'POST')

/**
 * 获取用户正在售卖的商品数量
 */
export const getSellingCount = () =>
  serverNoRepeatAjax<number>('/commodity/selling_count')
