import React, { useState } from 'react'
import { UserInfoQueryType } from '../../../api/server/user'
import { StyleSheet, Text, View } from 'react-native'
import BaseContainer from '../../../component/Container/BaseContainer'
import EnhancedLoadingView from '../../../component/Loading/EnhancedLoadingView'
import { getSoldOrderSimply, OrderDetail } from '../../../api/server/order'
import SimpleOrderPreview from '../component/SimpleOrderPreview'
import UserSimpleInfo from '../component/UserSimpleInfo'

interface UserInfoCardProps {
  userInfo: UserInfoQueryType
}

const UserInfoCard: React.FC<UserInfoCardProps> = props => {
  const { userInfo } = props
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const loadUserSoldOrder = () => getSoldOrderSimply(props.userInfo.userId)

  return (
    <View>
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
const styles = StyleSheet.create({
  recentActiveText: {
    color: '#000',
    fontSize: 16,
  },
  tipText: {
    fontSize: 12,
  },
})
export default UserInfoCard
