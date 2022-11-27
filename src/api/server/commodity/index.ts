import { Commodity, EsCommodity, ResponseTemplate } from '../types'
import { serverCancelOldAjax, serverNoRepeatAjax } from '../../request'
import { appendCdnPrefix } from '../../../utils/CdnUtil'

type PostCommodityType = Omit<
  Commodity,
  'commodityId' | 'ownerId' | 'createTime' | 'status'
>

/**
 * 创建一个商品
 * @param commodity
 */
export const createCommodity = (commodity: PostCommodityType) =>
  serverNoRepeatAjax<number>('/commodity/create', commodity, 'POST')

export const searchCommodity = (searchContent: string, page = 0) =>
  serverCancelOldAjax<EsCommodity[]>('/commodity/search', {
    s: searchContent,
    p: page,
  }).then(result => {
    result.data.forEach(value => {
      value.image = appendCdnPrefix('/' + value.image)
    })
    return result
  })

export type ProcessedCommodity = Omit<Commodity, 'images'> & {
  images: string[]
}

export const getCommodityDetail = (commodityId: number) =>
  new Promise<ResponseTemplate<ProcessedCommodity | null>>(
    (resolve, reject) => {
      serverNoRepeatAjax<Commodity | undefined>(`/commodity/${commodityId}`)
        .then(resp => {
          const data = resp.data
          if (data) {
            const arr = JSON.parse(data.images) as Array<string>
            data.previewImage = appendCdnPrefix('/' + data.previewImage)
            for (let i = 0; i < arr.length; i++) {
              arr[i] = appendCdnPrefix('/' + arr[i])
            }
            resolve({
              message: resp.message,
              code: resp.code,
              data: {
                ...data,
                images: arr,
              },
            })
          } else {
            resolve({
              data: null,
              code: resp.code,
              message: resp.message,
            })
          }
        })
        .catch(reject)
    }
  )

export const lockCommodity = (commodityId: number, remark?: string) =>
  serverNoRepeatAjax(`/commodity/${commodityId}/lock`, { r: remark }, 'POST')

/**
 * 获取用户正在售卖的商品数量
 * @deprecated
 */
export const getSellingCount = () =>
  serverNoRepeatAjax<number>('/commodity/selling_count')
