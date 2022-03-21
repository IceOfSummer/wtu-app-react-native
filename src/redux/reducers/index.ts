import { combineReducers } from 'redux'
import user, { UserState } from './user'
import lessonsTable, { LessonsTableStates } from './lessonsTable'

export default combineReducers({
  user,
  lessonsTable,
})

export type ReducerTypes = {
  user: UserState
  lessonsTable: LessonsTableStates
}
