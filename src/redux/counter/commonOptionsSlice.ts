import { createSlice } from '@reduxjs/toolkit'
import {
  CommonOptionsReducers,
  CommonOptionsStates,
} from '../types/commonOptionsTypes'

const initialState: CommonOptionsStates = {
  autoHideSubjectSelectPageTips: false,
}

const commonOptionsSlice = createSlice<
  CommonOptionsStates,
  CommonOptionsReducers
>({
  name: 'commonOptions',
  reducers: {
    modifyCommonOptions(state, { payload }) {
      Object.assign(state, payload)
    },
  },
  initialState,
})

export const { modifyCommonOptions } = commonOptionsSlice.actions
export default commonOptionsSlice.reducer
