import { serverNoRepeatAjax } from '../../request'

export type UserInfoQueryType = {
  userId: number
  credit: number
  nickname: string
  /**
   * @deprecated 该值永远都是{@link UserInfoQueryType#academy}
   */
  className: string
  academy: string
  signature?: string
}

/**
 * 查询用户信息
 * @param id
 */
export const getUserInfo = (id: number) =>
  serverNoRepeatAjax<UserInfoQueryType | undefined>(`/user/info/${id}`).then(
    r => {
      const data = r.data
      if (data) {
        data.className = data.academy
      }
      return r
    }
  )

/**
 * 查询多个用户的信息
 * @param ids 要查询的用户id
 */
export const getMultiUserInfo = async (ids: number[]) => {
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
  return serverNoRepeatAjax<Array<UserInfoQueryType>>(
    '/user/info/multi_query',
    { i: param }
  )
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

export type UserUpdate = {
  nickname?: string
  signature?: string
}

export const updateUserInfo = (user: UserUpdate) =>
  serverNoRepeatAjax('/user/update', user, 'POST')

export const requireEmailUpdateCaptcha = (email: string) =>
  serverNoRepeatAjax('/user/update/email/captcha', { e: email }, 'POST')

export const updateEmail = (captcha: string) =>
  serverNoRepeatAjax('/user/update/email/bind', { c: captcha }, 'POST')
