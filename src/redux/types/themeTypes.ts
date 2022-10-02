import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'

export type ThemeState = {
  colors: ThemeColors
  darkMode: boolean
}

export interface ThemeReducers extends SliceCaseReducers<ThemeState> {
  /**
   * 切换主题
   */
  toggleTheme: CaseReducer<ThemeState, PayloadAction<ThemeState>>
}
