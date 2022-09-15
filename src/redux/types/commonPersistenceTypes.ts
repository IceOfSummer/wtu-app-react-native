import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice'
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

export interface CommonPersistenceState {
  /**
   * 搜索历史
   */
  searchHistory: Array<string>
}

export interface CommonPersistenceReducers
  extends SliceCaseReducers<CommonPersistenceState> {
  /**
   * 添加历史搜索记录
   */
  addSearchHistory: CaseReducer<CommonPersistenceState, PayloadAction<string>>

  /**
   * 清除历史搜索记录
   */
  clearSearchHistory: CaseReducer<CommonPersistenceState, PayloadAction>
  /**
   * 将某条搜索记录的位置移动到第一位
   *
   * 若该位置超出数组范围，则会将其忽略
   */
  swapHistoryToFirst: CaseReducer<CommonPersistenceState, PayloadAction<number>>
}
