import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  LessonsTableReducers,
  LessonsTableStates,
  UpdateCurWeekAsyncAction,
} from '../types/lessonsTableTypes'
import { getCurTerm, getStanderDay } from '../../utils/DateUtils'
import { getCurYear } from '../reducers/lessonsTable'
import { getCurWeekFromServer } from '../../api/edu/classes'
import { LessonsTableActionConstant } from '../constant'
import { modifyOptions as modifyLessonsTableOptions } from '../actions/lessonsTable'

const initialState: LessonsTableStates = {
  lessons: [],
  options: {
    week: 1,
    year: getCurYear(),
    term: getCurTerm(),
    curWeekLastUpdate: Date.now(),
  },
}

export const updateCurWeek: UpdateCurWeekAsyncAction = createAsyncThunk(
  'lessonsTable/updateCurWeek',
  ({ year, term }, { dispatch }) => {
    getCurWeekFromServer(year, term)
      .then(resp =>
        dispatch(
          modifyLessonsTableOptions({
            week: resp,
          })
        )
      )
      .catch(() =>
        dispatch({
          type: LessonsTableActionConstant.updateCurWeek,
        })
      )
  }
)

const lessonsTableSlice = createSlice<LessonsTableStates, LessonsTableReducers>(
  {
    name: 'lessonsTable',
    reducers: {
      saveLessonsInfo(state, { payload }) {
        state.lessons = payload
      },
      modifyOptions(state, { payload }) {
        Object.assign(state, payload)
        if (payload.week) {
          state.options.curWeekLastUpdate = Date.now()
        }
      },
      checkCurWeek(state) {
        const start = new Date(state.options.curWeekLastUpdate!)
        const end = new Date()

        // 统一为星期一
        const startTimeGap = (getStanderDay(start) - 1) * 86400000
        const endTimeGap = (getStanderDay(end) - 1) * 86400000

        // 毫秒 / 秒 / 分 / 时 / 天 / 周
        const weekGap = Math.floor(
          (Date.now() -
            endTimeGap -
            (state.options.curWeekLastUpdate! - startTimeGap)) /
            1000 /
            60 /
            60 /
            24 /
            7
        )
        state.options.week = state.options.week! + weekGap
        state.options.curWeekLastUpdate = Date.now()
        console.log(`week gap: ${weekGap}, cur week ${state.options.week}`)
      },
    },
    initialState,
  }
)

export const { checkCurWeek, saveLessonsInfo, modifyOptions } =
  lessonsTableSlice.actions
export default lessonsTableSlice.reducer
