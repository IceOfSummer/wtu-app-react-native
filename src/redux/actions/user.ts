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

export const modifyLoginStatus = (
  status: boolean
): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: status,
})
