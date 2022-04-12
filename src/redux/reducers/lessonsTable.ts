import { Reducer } from 'redux'
import { LessonsTableActions } from '../actions/lessonsTable'
import { LessonsTableActionConstant } from '../constant'
import { getStanderDay } from '../../utils/DateUtils'
import { LessonsTableStates, Term } from '../types/lessonsTableTypes'

export function getCurTerm(): Term {
  // 1为一月
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 8) {
    // 下学期
    return 12
  } else {
    // 上学期
    return 3
  }
}

export function getCurYear(): number {
  const term = getCurTerm()
  const year = new Date().getFullYear()
  if (term === 12) {
    return year - 1
  } else {
    return year
  }
}

const initState: LessonsTableStates = {
  options: {
    week: 1,
    year: getCurYear(),
    term: getCurTerm(),
    curWeekLastUpdate: Date.now(),
  },
}

const lessonsTableReducer: Reducer<LessonsTableStates, LessonsTableActions> = (
  state = initState,
  action
) => {
  if (action.type === LessonsTableActionConstant.modifyOptions) {
    const copyObj = JSON.parse(JSON.stringify(state)) as LessonsTableStates
    Object.assign(copyObj.options, action.data)
    if (action.data.week) {
      copyObj.options.curWeekLastUpdate = Date.now()
    }
    return copyObj
  } else if (action.type === LessonsTableActionConstant.saveLessonsInfo) {
    const copyObj = JSON.parse(JSON.stringify(state)) as LessonsTableStates
    copyObj.lessons = action.data
    return copyObj
  } else if (action.type === LessonsTableActionConstant.updateCurWeek) {
    // 更新当前周
    return updateCurDay(state)
  }
  return state
}

function updateCurDay(state: LessonsTableStates): LessonsTableStates {
  const copyObj = JSON.parse(JSON.stringify(state)) as LessonsTableStates
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
  copyObj.options.week = state.options.week! + weekGap
  copyObj.options.curWeekLastUpdate = Date.now()
  console.log(`week gap: ${weekGap}, cur week ${copyObj.options.week}`)
  return copyObj
}

export default lessonsTableReducer
