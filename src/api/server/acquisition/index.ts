import { serverNoRepeatAjax } from '../../request'

type AcquisitionInsert = {
  title: string
  description?: string
  contract: string
  expectPrice?: string
}
export const insertAcquisition = (acquisition: AcquisitionInsert) =>
  serverNoRepeatAjax<number>('/acquisition/post', acquisition, 'POST')

export type AcquisitionQuery = Omit<Acquisition, 'description' | 'contract'>

export const queryNewlyAcquisition = (maxId?: number, size?: number) =>
  serverNoRepeatAjax<AcquisitionQuery[]>('/acquisition/query', {
    m: maxId,
    s: size,
  })

export type Acquisition = {
  id: number
  ownerId: number
  title: string
  nickname: string
  createTime: number
  expectPrice?: string
  description?: string
  contract: string
}

export const queryAcquisitionById = (id: number) =>
  serverNoRepeatAjax<Acquisition | undefined>(`/acquisition/op/${id}`)

export const queryAcquisitionByActive = (
  active: boolean,
  page?: number,
  size?: number
) =>
  serverNoRepeatAjax<Acquisition[]>('/acquisition/uploaded', {
    a: active ? 1 : 0,
    p: page,
    s: size,
  })

export const takeDownAcquisition = (acquisitionId: number) =>
  serverNoRepeatAjax(
    `/acquisition/op/${acquisitionId}/take_down`,
    undefined,
    'POST'
  )
