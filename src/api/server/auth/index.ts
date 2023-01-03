import { serverNoRepeatAjax } from '../../request'

type LoginResponse = {
  userId: number
  name: string
  nickname: string
  className: string
  wtuId: string
  email: string
  token: string
}

export const login = (username: string, password: string) =>
  serverNoRepeatAjax<LoginResponse>('/login', { username, password }, 'POST')

export const logout = () => serverNoRepeatAjax('/logout')

export const renewToken = () => serverNoRepeatAjax<string>('/auth/renew')
