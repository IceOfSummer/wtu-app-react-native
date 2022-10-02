import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserInfo, UserReducers, UserState } from '../types/wtuUserTypes'
import { getUserInfo } from '../../api/edu/applications'
import { LoginStatus, testLogin } from '../../api/edu/auth'

const initialState: UserState = {
  isLoginValid: false,
}

/**
 * 标记登录，并且获取用户基础身份信息
 */
export const markLogin = createAsyncThunk<UserInfo>(
  'user/markLogin',
  async () => {
    return await getUserInfo()
  }
)

type checkLoginArgs = (status: LoginStatus) => void

export const checkLogin = createAsyncThunk<void, checkLoginArgs>(
  'user/checkLogin',
  async (callback, { dispatch }) => {
    try {
      const status = await testLogin()
      // 登录成功
      console.log(
        `auto login status: ${status.isSuccess}, message: ${status.message}`
      )
      dispatch(modifyLoginStatus(status.isSuccess))
      callback?.(status)
    } catch (e) {
      const err = e as Error
      callback?.({
        message: err.message,
        isSuccess: false,
      })
    }
  }
)

export const wtuUserSlice = createSlice<UserState, UserReducers>({
  name: 'user',
  initialState,
  reducers: {
    saveUserCredentials(state, { payload }) {
      state.username = payload.username
      state.password = payload.password
    },
    markLoginExpired(state) {
      state.isLoginValid = false
    },
    saveUserInfo(state, action) {
      state.userInfo = action.payload
    },
    modifyLoginStatus(state, { payload }) {
      state.isLoginValid = payload
    },
  },
  extraReducers: {
    [markLogin.fulfilled.type]: (state, action?: UserInfo) => {
      if (action) {
        state.userInfo = action
      }
      state.isLoginValid = true
    },
    [markLogin.rejected.type]: state => {
      state.isLoginValid = true
    },
  },
})

export const {
  markLoginExpired,
  modifyLoginStatus,
  saveUserCredentials,
  saveUserInfo,
} = wtuUserSlice.actions

export default wtuUserSlice.reducer
