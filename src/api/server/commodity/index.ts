import { Commodity, EsCommodity, ResponseTemplate } from '../types'
import { serverCancelOldAjax, serverNoRepeatAjax } from '../../request'

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
