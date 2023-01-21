import { serverNoRepeatAjax } from '../../request'

type LoginResponse = {
  userId: number
  name: string
  nickname: string
  className: string
  wtuId: string
  email: string
  token: string
  roles: number
}

export const login = (username: string, password: string) =>
  serverNoRepeatAjax<LoginResponse>('/login', { username, password }, 'POST')

/**
 * @deprecated
 */
export const logout = () => Promise.resolve()

export const renewToken = () => serverNoRepeatAjax<string>('/auth/renew')
