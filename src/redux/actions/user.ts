import { Action } from 'redux'
import { UserActionConstant } from '../constant'
import { UserInfo } from '../reducers/user'
import { LoginStatus } from '../../api/edu/auth'
import {
  saveUserCredentials as _saveUserCredentials,
  modifyLoginStatus as _modifyLoginStatus,
  markLoginExpired as _markLoginExpired,
  markLogin as _markLogin,
  saveUserInfo as _saveUserInfo,
  checkLogin as _checkLogin,
} from '../counter/wtuUserSlice'

export type UserActions =
  | SaveUserCredentials
  | ModifyLoginStatusAction
  | MarkLoginAction
  | SaveUserInfoAction
  | CheckLoginAction

/**
 * ===============================
 * 保存用户信息(用户名, 密码)
 * @see _saveUserCredentials
 * @deprecated
 */
export interface SaveUserCredentials extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserCredentials
  data: {
    username: string
    password: string
  }
}

/**
 * @deprecated
 * @see _saveUserCredentials
 */
export const saveUserCredentials = (username: string, password: string) =>
  _saveUserCredentials({
    username,
    password,
  })

/**
 * ==================================
 * 修改登录状态
 * @deprecated
 * @see _modifyLoginStatus
 */
export interface ModifyLoginStatusAction extends Action<UserActionConstant> {
  type: UserActionConstant.modifyLoginStatus
  data: boolean
}

/**
 * @deprecated
 */
export const markLoginExpired = _markLoginExpired

/**
 * @param status true表示登录有效, false表示无效
 * @deprecated
 * @see _modifyLoginStatus
 */
export const modifyLoginStatus = _modifyLoginStatus

/**
 * ===================================
 * 标记用户已经登录
 * @deprecated
 * @see _markLogin
 */
export interface MarkLoginAction extends Action<UserActionConstant> {
  type: UserActionConstant.markLogin
  data?: UserInfo
}

/**
 * @deprecated
 * @see _markLogin
 */
export const markLogin = _markLogin

/**
 * ================================================
 * 保存用户信息(姓名, 入学时间等)
 * @deprecated
 * @see _saveUserInfo
 */
export interface SaveUserInfoAction extends Action<UserActionConstant> {
  type: UserActionConstant.saveUserInfo
  data?: UserInfo
}

/**
 * @deprecated
 * @see _saveUserInfo
 */
export const saveUserInfo = _saveUserInfo

/**
 * =============================================
 * 检查用户登录状态, 若登录过期则尝试自动重新登录
 * @deprecated
 * @see _checkLogin
 */
export interface CheckLoginAction extends Action<UserActionConstant> {
  type: UserActionConstant.checkLogin
  data: LoginStatus
}

export const checkLogin = _checkLogin
