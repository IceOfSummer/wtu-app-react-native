import { Action } from 'redux'
import { UserActionConstant } from '../constant'

export type UserActions = SaveUserInfoAction

export interface SaveUserInfoAction extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserInfo
  data: {
    username: string
    password: string
  }
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
