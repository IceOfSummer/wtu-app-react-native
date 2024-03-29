import React, { useState } from 'react'
import { UserInfoQueryType } from '../../../api/server/user'
import { StyleSheet, Text, View } from 'react-native'
import BaseContainer from '../../../component/Container/BaseContainer'
import EnhancedLoadingView from '../../../component/Loading/EnhancedLoadingView'
import { getSoldOrderSimply, OrderPreview } from '../../../api/server/order'
import SimpleOrderPreview from '../component/SimpleOrderPreview'
import UserSimpleInfo from '../component/UserSimpleInfo'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../redux/counter'
import NavigationHeader from '../../../component/Container/NavigationHeader'
import { useNavigation } from '@react-navigation/native'
import { CHAT_PAGE, UseNavigationGeneric } from '../../../router'
import Toast from 'react-native-root-toast'

interface UserInfoCardProps {
  userInfo: UserInfoQueryType
}

const UserInfoCard: React.FC<UserInfoCardProps> = props => {
  const { userInfo } = props
  const [orders, setOrders] = useState<OrderPreview[]>([])
  const loadUserSoldOrder = () => getSoldOrderSimply(props.userInfo.userId)
  const nav = useNavigation<UseNavigationGeneric>()
  const selfUid =
    useStore<ReducerTypes>().getState().serverUser.userInfo?.uid ?? -1
  return (
    <View>
      <NavigationHeader
        title="用户信息"
        navigation={nav}
        backgroundColor={global.colors.boxBackgroundColor}>
        <ChatText
          show={selfUid !== userInfo.userId}
          targetId={userInfo.userId}
        />
      </NavigationHeader>
      <UserSimpleInfo userInfo={userInfo} />
      <BaseContainer>
        <View>
          <Text style={styles.recentActiveText}>最近活动</Text>
          <Text style={styles.tipText}>仅显示最近5条出售记录...</Text>
        </View>
        <EnhancedLoadingView loadData={loadUserSoldOrder} setData={setOrders}>
          {orders.map(value => (
            <SimpleOrderPreview order={value} key={value.orderId} />
          ))}
          {orders.length === 0 ? (
            <View style={{ paddingVertical: 50 }}>
              <Text style={global.styles.primaryTipText}>暂时没有记录哦!</Text>
            </View>
          ) : null}
        </EnhancedLoadingView>
      </BaseContainer>
    </View>
  )
}

interface ChatTextProps {
  show?: boolean
  targetId: number
}
const ChatText: React.FC<ChatTextProps> = props => {
  const nav = useNavigation<UseNavigationGeneric>()
  const store = useStore<ReducerTypes>()
  const chat = () => {
    if (!store.getState().serverUser.authenticated) {
      Toast.show('请先登录')
      return
    }
    nav.navigate(CHAT_PAGE, { uid: props.targetId })
  }
  if (props.show) {
    return (
      <View>
        <Text style={styles.chatText} onPress={chat}>
          私聊
        </Text>
      </View>
    )
  } else {
    return null
  }
}

const styles = StyleSheet.create({
  recentActiveText: {
    color: '#000',
    fontSize: 16,
  },
  tipText: {
    fontSize: 12,
  },
  chatText: {
    marginRight: 10,
    fontSize: global.styles.$font_size_base,
    color: global.colors.primaryColor,
  },
})
export default UserInfoCard
