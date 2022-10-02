import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice'
import { CaseReducer } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/src/createAction'

export type UserState = {
  username?: string
  password?: string
  isLoginValid: boolean
  userInfo?: UserInfo
}

export type UserInfo = {
  name: string
  enrollmentDate: string
}

export interface UserReducers extends SliceCaseReducers<UserState> {
  /**
   * 保存用户信息
   */
  saveUserCredentials: CaseReducer<
    UserState,
    PayloadAction<{ username: string; password: string }>
  >
  /**
   * 标记登录过期
   */
  markLoginExpired: CaseReducer<UserState, PayloadAction<undefined>>
  /**
   * 更改登录状态
   * true表示登录有效, false表示无效
   */
  modifyLoginStatus: CaseReducer<UserState, PayloadAction<boolean>>
  /**
   * 保存用户信息
   */
  saveUserInfo: CaseReducer<UserState, PayloadAction<UserInfo>>
}
