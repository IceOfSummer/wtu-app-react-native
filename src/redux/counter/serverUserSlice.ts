import { createSlice } from '@reduxjs/toolkit'
import { ServerUserReducers, ServerUserState } from '../types/serverUserTypes'

const serverUserSlice = createSlice<ServerUserState, ServerUserReducers>({
  name: 'serverUserSlice',
  initialState: {
    authenticated: false,
  },
  reducers: {
    markLogin(state, { payload }) {
      state.authenticated = true
      state.userInfo = payload
    },
  },
})

export const { markLogin } = serverUserSlice.actions

export default serverUserSlice.reducer
