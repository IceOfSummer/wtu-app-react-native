import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  TemporaryDataReducers,
  TemporaryDataState,
} from '../types/temporaryDataTypes'
import { innerCombineObject } from '../../utils/ObjectUtils'
import {
  CombinedEventRemind,
  queryEventRemind,
} from '../../api/server/event_remind'

const initialState: TemporaryDataState = {
  isCheckLoginDone: false,
  globalStates: {},
  tradeStat: {
    receiveCount: 0,
    deliveryCount: 0,
  },
}

export const loadRemindTip = createAsyncThunk<CombinedEventRemind[], void>(
  '/temporaryData/loadMessageTip',
  async () => {
    const reminds = await queryEventRemind()
    return reminds.data
  }
)

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
      Object.assign(state, payload)
    },
  },
  initialState,
  extraReducers: {},
})

export const { markCheckLoginDone, saveGlobalState, modifyKVData } =
  temporaryDataSlice.actions

export default temporaryDataSlice.reducer
