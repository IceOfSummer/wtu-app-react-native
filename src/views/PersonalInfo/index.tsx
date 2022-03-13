import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { getUserInfo, UserInfo } from '../../api/edu/applications'
import { connect } from 'react-redux'
import { modifyLoginStatus } from '../../redux/actions/user'
import { ReducerTypes } from '../../redux/reducers'
import Toast from 'react-native-toast-message'
import { NAV_TOAST } from '../../component/DiyToast'

interface PersonalInfoProps {}

const PersonalInfo: React.FC<
  PersonalInfoProps & StoreProps & StoreActions
> = props => {
  const [userInfo, setUserInfo] = useState<UserInfo>()

  /**
   * 检查登录状态, 返回true表示登录状态无效
   */
  const isInvalidState = (): boolean => {
    if (props.expired) {
      Toast.show({
        type: NAV_TOAST,
        text1: '登录过期',
        text2: '点击重新登录',
      })
      return true
    }
    return false
  }

  /**
   * 加载用户信息
   */
  const loadUserInfo = () => {
    if (isInvalidState()) {
      // return
    }
    getUserInfo().then(resp => {
      setUserInfo(resp)
    })
  }

  useEffect(() => {
    loadUserInfo()
  }, [])
  return (
    <View>
      {userInfo ? <Text>{userInfo.name}</Text> : <Text>请先登录</Text>}
    </View>
  )
}

interface StoreProps {
  username?: string
  expired: boolean
}

interface StoreActions {
  modifyLoginStatus: (...args: Parameters<typeof modifyLoginStatus>) => void
}

export default connect<
  StoreProps,
  StoreActions,
  PersonalInfoProps,
  ReducerTypes
>(
  initialState => ({
    username: initialState.user.username,
    expired: initialState.user.expired,
  }),
  {
    modifyLoginStatus,
  }
)(PersonalInfo)
