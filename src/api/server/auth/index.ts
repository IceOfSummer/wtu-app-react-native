import { serverNoRepeatAjax } from '../../request'

type UserInfo = {
  userId: number
  name: string
  nickname: string
  className: string
  wtuId: string
  email: string
}

export const login = (username: string, password: string) =>
  serverNoRepeatAjax<UserInfo>('/login', { username, password }, 'POST')
