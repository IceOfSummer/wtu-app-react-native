import { createSlice } from '@reduxjs/toolkit'
import {
  TemporaryDataReducers,
  TemporaryDataState,
} from '../types/temporaryDataTypes'
import { innerCombineObject } from '../../utils/ObjectUtils'

const initialState: TemporaryDataState = {
  isCheckLoginDone: false,
  globalStates: {},
}

const temporaryDataSlice = createSlice<
  TemporaryDataState,
  TemporaryDataReducers
>({
  name: 'temporaryData',
  reducers: {
    markCheckLoginDone(state) {
      state.isCheckLoginDone = true
    },
    saveGlobalState(state, { payload }) {
      if (typeof payload === 'object') {
        state.globalStates = innerCombineObject(state.globalStates, payload)
      } else {
        state.globalStates = Object.assign(state.globalStates, payload)
      }
    },
    modifyKVData(state, { payload }) {
      Object.keys(payload).forEach(key => {
        // @ts-ignore
        state[key] = payload[key]
      })
    },
  },
  initialState,
})

export const { markCheckLoginDone, saveGlobalState, modifyKVData } =
  temporaryDataSlice.actions

export default temporaryDataSlice.reducer
