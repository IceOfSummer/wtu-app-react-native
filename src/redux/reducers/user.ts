import { UserActionConstant } from '../constant'
import { Reducer } from 'redux'
import { UserActions } from '../actions/user'

export type UserState = {
  username?: string
  password?: string
  expired: boolean
}

const initState: UserState = {
  expired: true,
}
const userReducer: Reducer<UserState, UserActions> = (
  state = initState,
  action
) => {
  console.log(action)
  const curAction = action.type
  if (curAction === UserActionConstant.saveUserInfo) {
    const copyState: UserState = JSON.parse(JSON.stringify(state))
    copyState.username = action.data.username
    copyState.password = action.data.password
    return copyState
  } else if (curAction === UserActionConstant.modifyLoginStatus) {
    if (state.expired === action.data) {
      return state
    }
    const copyState: UserState = JSON.parse(JSON.stringify(state))
    copyState.expired = action.data
    return copyState
  }
  return state
}

export default userReducer
