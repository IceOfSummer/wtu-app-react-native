import { AnyAction, createSlice } from '@reduxjs/toolkit'
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
    statusBarColor: '#fff',
    shallowBoxBackgroundColor: 'rgb(240, 240, 240)',
  },
  darkMode: true,
}

const themeSlice = createSlice<ThemeState, ThemeReducers>({
  name: 'theme',
  initialState: lightTheme,
  reducers: {
    toggleTheme(state, { payload }) {
      Object.assign(state, payload)
      Object.assign(global.colors, payload.colors)
    },
  },
})

const reducer = (state: ThemeState | undefined, action: AnyAction) => {
  if (action.key === 'theme' && action.payload) {
    Object.assign(global.colors, action.payload.colors)
  }
  return themeSlice.reducer(state, action)
}

export const { toggleTheme } = themeSlice.actions

export default reducer
