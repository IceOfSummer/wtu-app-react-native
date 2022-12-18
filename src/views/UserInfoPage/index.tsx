import React, { useState } from 'react'
import { Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { USER_INFO_PAGE, UseRouteGeneric } from '../../router'
import { getUserInfo, UserInfoQueryType } from '../../api/server/user'
import UserInfoCard from './UserInfoCard'
import EnhancedLoadingView from '../../component/Loading/EnhancedLoadingView'
import { useDispatch } from 'react-redux'
import { saveUserToCache } from '../../redux/counter/serverUserSlice'

interface UserInfoPageProps {}

/**
 * 用户详细界面
 */
const UserInfoPage: React.FC<UserInfoPageProps> = () => {
  const route = useRoute<UseRouteGeneric<typeof USER_INFO_PAGE>>()
  const [userInfo, setUserInfo] = useState<UserInfoQueryType>()
  const dispatch = useDispatch()
  const loadData = async () => {
    const info = await getUserInfo(route.params.id)
    if (info.data) {
      dispatch(saveUserToCache(info.data))
    }
    return info
  }

  return (
    <EnhancedLoadingView loadData={loadData} setData={setUserInfo}>
      {userInfo ? (
        <UserInfoCard userInfo={userInfo} />
      ) : (
        <Text style={global.styles.errorTipText}>没有找到该用户</Text>
      )}
    </EnhancedLoadingView>
  )
}

export default UserInfoPage
