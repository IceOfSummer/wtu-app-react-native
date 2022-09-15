import { ResponseTemplate } from '../types'
import { serverNoRepeatAjax } from '../../index'

export const login = (username: string, password: string) =>
  serverNoRepeatAjax<ResponseTemplate>('/login', { username, password }, 'POST')
