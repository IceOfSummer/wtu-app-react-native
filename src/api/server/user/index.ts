import { serverNoRepeatAjax } from '../../request'

export type UserInfoView = {
  userId: number
  username: string
  wtuUsername: string
  status: number
  credit: number
  name: string
  bedroom: string
  avatar?: string
}

export const getUserInfo = (id: number) =>
  serverNoRepeatAjax<UserInfoView | undefined>(`/user/info/${id}`)
