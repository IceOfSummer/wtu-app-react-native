import React from 'react'
import { ReducerTypes } from '../../../redux/counter'
import { useStore } from 'react-redux'

const AuthorizationGate: React.FC = props => {
  // FIXME 切换用户后需要再次设置
  global.token = useStore<ReducerTypes>().getState().serverUser.token
  return <React.Fragment>{props.children}</React.Fragment>
}

export default AuthorizationGate
