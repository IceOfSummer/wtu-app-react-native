import { combineReducers } from 'redux'
import user, { UserState } from './user'

export default combineReducers({
  user,
})

export type ReducerTypes = {
  user: UserState
}
