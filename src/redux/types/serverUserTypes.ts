import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'

export type ServerUserState = {
  /**
   * 用户是否登录
   */
  authenticated: boolean
  /**
   * 用户信息, 若{@link ServerUserState#authenticated}为true，则该值<b>一定</b>非空
   */
  userInfo?: ServerUserInfo
}

/**
 * 用户身份信息
 */
export type ServerUserInfo = {
  /**
   * 用户名
   */
  username: string
  /**
   * 昵称
   */
  nickname: string
}

export interface ServerUserReducers extends SliceCaseReducers<ServerUserState> {
  /**
   * 标记用户登录成功
   */
  markLogin: CaseReducer<ServerUserState, PayloadAction<ServerUserInfo>>
}
