import { UserActionConstant } from '../constant'
import { Reducer } from 'redux'
import { UserActions } from '../actions/user'

export type UserState = {
  username?: string
  password?: string
}

const initState: UserState = {}
const userReducer: Reducer<UserState, UserActions> = (
  state = initState,
  action
) => {
  console.log(action.type)
  switch (action.type) {
    case UserActionConstant.saveUserInfo:
      const copyState: UserState = JSON.parse(JSON.stringify(state))
      copyState.username = action.data.username
      copyState.password = action.data.password
      return copyState
    default:
      return state
  }
}

export default userReducer
