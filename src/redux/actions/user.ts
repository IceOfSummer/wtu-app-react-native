import { Action } from 'redux'
import { UserActionConstant } from '../constant'
import { getUserInfo } from '../../api/edu/applications'
import { UserInfo } from '../reducers/user'
import { Dispatch } from 'react'
import { LoginStatus, testLogin } from '../../api/edu/auth'

export type UserActions =
  | SaveUserCredentials
  | ModifyLoginStatusAction
  | MarkLoginAction
  | SaveUserInfoAction
  | CheckLoginAction

/**
 * ===============================
 * 保存用户信息(用户名, 密码)
 */
export interface SaveUserCredentials extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserCredentials
  data: {
    username: string
    password: string
  }
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

/**
 * ==================================
 * 修改登录状态
 */
export interface ModifyLoginStatusAction extends Action<UserActionConstant> {
  type: UserActionConstant.modifyLoginStatus
  data: boolean
}
export const markLoginExpired = (): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: false,
})
/**
 * @param status true表示登录有效, false表示无效
 */
export const modifyLoginStatus = (
  status: boolean
): ModifyLoginStatusAction => ({
  type: UserActionConstant.modifyLoginStatus,
  data: status,
})

/**
 * ===================================
 * 标记用户已经登录
 */
export interface MarkLoginAction extends Action<UserActionConstant> {
  type: UserActionConstant.markLogin
  data?: UserInfo
}

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

/**
 * ================================================
 * 保存用户信息(姓名, 入学时间等)
 */
export interface SaveUserInfoAction extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserInfo
  data?: UserInfo
}

export const saveUserInfo = (info: UserInfo): SaveUserInfoAction => ({
  type: UserActionConstant.saveUserInfo,
  data: info,
})

/**
 * =============================================
 * 检查用户登录状态, 若登录过期则尝试自动重新登录
 */
export interface CheckLoginAction extends Action<UserActionConstant> {
  type: UserActionConstant.checkLogin
  data: LoginStatus
}

export const checkLogin = () => {
  return (dispatch: Dispatch<ModifyLoginStatusAction>) => {
    testLogin()
      .then(status => {
        // 登录成功
        console.log(
          `auto login status: ${status.isSuccess}, message: ${status.message}`
        )
        dispatch(modifyLoginStatus(status.isSuccess))
      })
      .catch(() => null)
  }
}
