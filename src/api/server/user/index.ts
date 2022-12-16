import { serverNoRepeatAjax } from '../../request'
import { ResponseTemplate } from '../types'
import { responseArrayParser, responseParser } from '../../util'

export type UserInfoView = {
  uid: number
  username: string
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
  un: 'username',
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
  param = param.replace(/,$/, '')
  console.log(param)
  const resp = await serverNoRepeatAjax<Array<UglyUserInfo>>(
    '/user/info/multi_query',
    { i: param }
  )
  return responseArrayParser<UserInfoView>(userInfoMapping, resp)
}

export type WtuAuthInitParam = {
  salt: string
  lt: string
  cookies: Record<string, string>
  captcha: string
}

export const getRegisterInitParam = (username: string) =>
  serverNoRepeatAjax<WtuAuthInitParam>('/user/register/init', {
    u: username,
  }).then(r => {
    r.data.captcha = 'data:image/jpeg;base64,' + r.data.captcha
    return r
  })

type RegisterParam = {
  wtuUsername: string
  wtuPassword: string
  wtuCaptcha: string
  lt: string
  registerUsername: string
  registerPassword: string
  cookies: Record<string, string>
}

export const register = (param: RegisterParam) =>
  serverNoRepeatAjax(
    '/user/register/do',
    {
      ru: param.registerUsername,
      rp: param.registerPassword,
      un: param.wtuUsername,
      wp: param.wtuPassword,
      wc: param.wtuCaptcha,
      lt: param.lt,
      sid: param.cookies.JSESSIONID_auth,
      route: param.cookies.route,
    },
    'POST'
  )
