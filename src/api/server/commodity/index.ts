import { Commodity, EsCommodity, ResponseTemplate } from '../types'
import { serverCancelOldAjax, serverNoRepeatAjax } from '../../request'
import { appendCdnPrefix } from '../../../utils/CdnUtil'

type PostCommodityType = Omit<
  Commodity,
  'commodityId' | 'ownerId' | 'createTime' | 'status'
>

function castOne(commodity: Commodity): ProcessedCommodity {
  if (commodity.previewImage) {
    commodity.previewImage = appendCdnPrefix(commodity.previewImage)
  }
  if (!commodity.images) {
    return {
      ...commodity,
      images: [],
    }
  }
  const imgs = JSON.parse(commodity.images) as Array<string>
  for (let i = 0; i < imgs.length; i++) {
    imgs[i] = appendCdnPrefix(imgs[i])
  }
  return {
    ...commodity,
    images: imgs,
  }
}

function castArray(commodity: Commodity[]): ProcessedCommodity[] {
  const r: ProcessedCommodity[] = []
  commodity.forEach(value => {
    r.push(castOne(value))
  })
  return r
}

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
      serverNoRepeatAjax<Commodity | undefined>(`/commodity/op/${commodityId}`)
        .then(resp => {
          resolve({
            data: resp.data ? castOne(resp.data) : null,
            code: resp.code,
            message: resp.message,
          })
        })
        .catch(reject)
    }
  )

export const lockCommodity = (
  commodityId: number,
  count: number,
  remark?: string
) =>
  serverNoRepeatAjax<number>(
    `/commodity/op/${commodityId}/lock`,
    { r: remark, c: count },
    'POST'
  )

/**
 * 获取用户正在售卖的商品数量
 * @deprecated
 */
export const getSellingCount = () =>
  serverNoRepeatAjax<number>('/commodity/selling_count')

export const getUploadedCommodity = (page: number = 0, size = 5) =>
  serverNoRepeatAjax<Commodity[]>('/commodity/uploaded', {
    p: page,
    s: size,
  }).then(r => {
    return {
      ...r,
      data: castArray(r.data),
    }
  })

/**
 * 更新货物。
 * <p>
 * 仅可更新{@link Commodity#name}, {@link Commodity#price},
 * {@link Commodity#tradeLocation}, {@link Commodity#description}。
 * 更新其他字段可能会导致Bad Request
 */
export const updateCommodity = (
  commodityId: number,
  commodity: Partial<Commodity>
) =>
  serverNoRepeatAjax(`/commodity/op/${commodityId}/update`, commodity, 'POST')

/**
 * 下架商品
 */
export const takeDownCommodity = (commodityId: number) =>
  serverNoRepeatAjax(`/commodity/op/${commodityId}/close`, undefined, 'POST')

/**
 * 该返回值某些属性可能为空
 */
export const getSuggestCommodity = (maxId?: number) =>
  serverNoRepeatAjax<Commodity[]>('/commodity/suggest', { m: maxId }).then(
    r => {
      return {
        ...r,
        data: castArray(r.data),
      }
    }
  )
