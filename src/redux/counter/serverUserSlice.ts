import { createSlice } from '@reduxjs/toolkit'
import { ServerUserReducers, ServerUserState } from '../types/serverUserTypes'

const initialState: ServerUserState = __DEV__
  ? {
      authenticated: true,
      userInfo: {
        uid: 1,
        username: '123456',
        nickname: '123456',
      },
    }
  : {
      authenticated: false,
    }

const serverUserSlice = createSlice<ServerUserState, ServerUserReducers>({
  name: 'serverUserSlice',
  initialState,
  reducers: {
    markLogin(state, { payload }) {
      state.authenticated = true
      state.userInfo = payload
    },
  },
})

export const { markLogin } = serverUserSlice.actions

export default serverUserSlice.reducer
