import { Action } from 'redux'
import { UserActionConstant } from '../constant'
import { getUserInfo } from '../../api/edu/applications'
import { UserInfo } from '../reducers/user'
import { Dispatch } from 'react'

export type UserActions =
  | SaveUserCredentials
  | ModifyLoginStatusAction
  | MarkLoginAction
  | SaveUserInfoAction

export interface SaveUserCredentials extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserCredentials
  data: {
    username: string
    password: string
  }
}

export interface ModifyLoginStatusAction extends Action<UserActionConstant> {
  type: UserActionConstant.modifyLoginStatus
  data: boolean
}

export interface MarkLoginAction extends Action<UserActionConstant> {
  type: UserActionConstant.markLogin
  data?: UserInfo
}

export interface SaveUserInfoAction extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserInfo
  data?: UserInfo
}

export const saveUserCredentials = (
  username: string,
  password: string
): SaveUserCredentials => ({
  type: UserActionConstant.saveUserCredentials,
  data: {
    username,
    password,
  },
})

export const saveUserInfo = (info: UserInfo): SaveUserInfoAction => ({
  type: UserActionConstant.saveUserInfo,
  data: info,
})

export const markLoginExpired = (): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: false,
})

export const markLogin = () => {
  return (dispatch: Dispatch<MarkLoginAction>) => {
    getUserInfo()
      .then(resp => {
        dispatch({
          type: UserActionConstant.markLogin,
          data: resp,
        })
      })
      .catch(e => {
        console.error(e)
        dispatch({
          type: UserActionConstant.markLogin,
          data: undefined,
        })
      })
  }
}
