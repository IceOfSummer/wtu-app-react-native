import { createSlice } from '@reduxjs/toolkit'
import { ThemeReducers, ThemeState } from '../types/themeTypes'

export const lightTheme: ThemeState = {
  colors: {
    primaryColor: '#007aff',
    success_color: '#4cd964',
    warning_color: '#f0ad4e',
    error_color: '#dd524d',
    backgroundColor: '#f5f6fa',
    boxBackgroundColor: '#fff',
    textColor: '#000',
    infoTextColor: '#999',
    borderColor: '#c8c7cc',
  },
  darkMode: true,
}

const themeSlice = createSlice<ThemeState, ThemeReducers>({
  name: 'theme',
  initialState: lightTheme,
  reducers: {
    toggleTheme(state, { payload }) {
      Object.assign(state, payload)
    },
  },
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer
