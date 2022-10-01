import { CaseReducer, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'

export type ThemeState = {
  colors: Colors
  darkMode: boolean
}

export type Colors = {
  primaryColor: string
  success_color: string
  warning_color: string
  error_color: string
  backgroundColor: string
  boxBackgroundColor: string
  textColor: string
  infoTextColor: string
  borderColor: string
}

export interface ThemeReducers extends SliceCaseReducers<ThemeState> {
  /**
   * 切换主题
   */
  toggleTheme: CaseReducer<ThemeState, PayloadAction<ThemeState>>
}
