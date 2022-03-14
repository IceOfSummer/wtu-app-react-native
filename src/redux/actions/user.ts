import { Action } from 'redux'
import { UserActionConstant } from '../constant'

export type UserActions = SaveUserInfoAction | ModifyLoginStatusAction

export interface SaveUserInfoAction extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserInfo
  data: {
    username: string
    password: string
  }
}

export interface ModifyLoginStatusAction extends Action<UserActionConstant> {
  type: UserActionConstant.modifyLoginStatus
  data: boolean
}

export const saveUserInfo = (
  username: string,
  password: string
): SaveUserInfoAction => ({
  type: UserActionConstant.saveUserInfo,
  data: {
    username,
    password,
  },
})

/**
 * @deprecated
 * @see markLogin 标记已经登录
 * @see markLoginExpired 标记登录过期
 */
export const modifyLoginStatus = (
  status: boolean
): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: status,
})

export const markLoginExpired = (): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: false,
})

export const markLogin = (): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: true,
})
