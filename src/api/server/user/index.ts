import { serverNoRepeatAjax } from '../../request'
import { ResponseTemplate } from '../types'
import { responseArrayParser, responseParser } from '../../util'

export type UserInfoView = {
  uid: number
  name?: string
  bedroom?: string
  credit: number
  nickname?: string
}

type UglyUserInfo = {
  u: number
  n?: string
  b?: string
  c: number
  i?: string
}

const userInfoMapping = {
  u: 'uid',
  n: 'name',
  b: 'bedroom',
  c: 'credit',
  i: 'nickname',
}

/**
 * 查询用户信息
 * @param id
 */
export const getUserInfo = (id: number) =>
  serverNoRepeatAjax<UglyUserInfo | undefined>(`/user/info/${id}`).then(resp =>
    responseParser<UserInfoView>(userInfoMapping, resp)
  )

/**
 * 查询多个用户的信息
 * @param ids 要查询的用户id
 */
export const getMultiUserInfo = async (
  ids: number[]
): Promise<ResponseTemplate<Array<UserInfoView>>> => {
  if (ids.length === 0) {
    return {
      message: 'success',
      data: [],
      code: 0,
    }
  }
  let param = ''
  ids.forEach(value => {
    param += value + ','
  })
  console.log(param)
  const resp = await serverNoRepeatAjax<Array<UglyUserInfo>>(
    '/user/info/multi_query',
    { i: param }
  )
  return responseArrayParser<UserInfoView>(userInfoMapping, resp)
}
