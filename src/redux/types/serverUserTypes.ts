import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import { ServerUser } from '../../sqlite/user'
import { UserInfoQueryType } from '../../api/server/user'

export type ServerUserState = {
  /**
   * 用户是否登录
   */
  authenticated: boolean
  /**
   * 用户信息, 若{@link ServerUserState#authenticated}为true，则该值<b>一定</b>非空
   */
  userInfo?: ServerUserInfo
  /**
   * 缓存用户信息
   *
   * <b>不要使用redux-priests来持久化该属性！因为它可能会很大</b>
   */
  cachedUser: CachedUser
}

export type CachedUser = Record<number, ServerUser>

/**
 * 用户身份信息
 */
export type ServerUserInfo = {
  /**
   * 用户id
   */
  uid: number
  /**
   * 用户名
   * @deprecated 该值一定为空字符串或undefined
   */
  username: string
  /**
   * 昵称
   */
  nickname: string
  /**
   * 真实姓名
   */
  name: string
  /**
   * 班级名
   */
  className: string
  email?: string
  /**
   * 教务系统学号
   */
  wtuId: string
}

type Reducer<T> = CaseReducer<ServerUserState, PayloadAction<T>>

export interface ServerUserReducers extends SliceCaseReducers<ServerUserState> {
  /**
   * 标记用户登录成功并保存其uid
   */
  markLogin: Reducer<ServerUserInfo>
  /**
   * 更新用户信息
   */
  updateServerUserInfo: Reducer<Partial<ServerUserInfo>>
  /**
   * 标记用户的登录失效
   */
  markLoginInvalid: Reducer<void>
  /**
   * 保存用户信息
   */
  saveUserToCache: Reducer<UserInfoQueryType>
  /**
   * 合并用户信息缓存
   */
  combineUserCache: Reducer<CachedUser>
}
