import { serverNoRepeatAjax } from '../../request'

export const login = (username: string, password: string) =>
  serverNoRepeatAjax<number>('/login', { username, password }, 'POST')
