import {
  CommonPersistenceReducers,
  CommonPersistenceState,
} from '../types/commonPersistenceTypes'
import { createSlice } from '@reduxjs/toolkit'

const initialState: CommonPersistenceState = {
  searchHistory: [],
}

/**
 * 存放需要持久化的数据
 */
const commonPersistenceSlice = createSlice<
  CommonPersistenceState,
  CommonPersistenceReducers
>({
  name: 'commonPersistence',
  reducers: {
    addSearchHistory: (state, { payload }) => {
      state.searchHistory.push(payload)
    },
    /**
     * 清除历史搜索记录
     *
     * 可能需要使用useForceUpdate让页面强制刷新
     * @param state
     */
    clearSearchHistory: state => {
      state.searchHistory = []
    },
    swapHistoryToFirst: (state, { payload }) => {
      const len = state.searchHistory.length
      if (payload < 0 || payload >= len) {
        return
      }
      const cpy = Array.from(state.searchHistory)
      const old = cpy[0]
      cpy[0] = cpy[payload]
      cpy[payload] = old
      state.searchHistory = cpy
    },
  },
  initialState: initialState,
})

export const { addSearchHistory, clearSearchHistory, swapHistoryToFirst } =
  commonPersistenceSlice.actions

export default commonPersistenceSlice.reducer
