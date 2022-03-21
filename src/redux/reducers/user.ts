import { UserActionConstant } from '../constant'
import { Reducer } from 'redux'
import { UserActions } from '../actions/user'

export type UserState = {
  username?: string
  password?: string
  isLoginValid: boolean
  userInfo?: UserInfo
}

export type UserInfo = {
  name: string
  enrollmentDate: string
}

const initState: UserState = {
  isLoginValid: false,
}
const userReducer: Reducer<UserState, UserActions> = (
  state = initState,
  action
) => {
  const curAction = action.type
  const copyState: UserState = JSON.parse(JSON.stringify(state))

  if (curAction === UserActionConstant.saveUserCredentials) {
    copyState.username = action.data.username
    copyState.password = action.data.password
    return copyState
  } else if (curAction === UserActionConstant.modifyLoginStatus) {
    if (state.isLoginValid === action.data) {
      return state
    }
    copyState.isLoginValid = action.data
    return copyState
  } else if (curAction === UserActionConstant.markLogin) {
    if (action.data) {
      copyState.userInfo = action.data
    }
    copyState.isLoginValid = true
    return copyState
  } else if (curAction === UserActionConstant.saveUserInfo) {
    copyState.userInfo = action.data
    return copyState
  }
  return state
}

export default userReducer
