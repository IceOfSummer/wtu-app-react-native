import React, { useState } from 'react'
import { UserInfoView } from '../../../api/server/user'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import BaseContainer from '../../../component/Container/BaseContainer'
import EnhancedLoadingView from '../../../component/Loading/EnhancedLoadingView'
import { getSoldOrderSimply, SimpleOrder } from '../../../api/server/order'
import SimpleOrderPreview from '../component/SimpleOrderPreview'

interface UserInfoCardProps {
  userInfo: UserInfoView
}

const UserInfoCard: React.FC<UserInfoCardProps> = props => {
  const { userInfo } = props
  const [orders, setOrders] = useState<SimpleOrder[]>([])
  const getCreditColor = () => {
    if (userInfo.credit >= 90) {
      return 'green'
    } else if (userInfo.credit >= 80) {
      return 'yellow'
    } else {
      return 'red'
    }
  }

  const loadUserSoldOrder = () => getSoldOrderSimply(props.userInfo.userId)

  return (
    <View>
      <BaseContainer>
        <FastImage
          style={styles.avatar}
          source={
            userInfo.avatar
              ? { uri: userInfo.avatar }
              : require('../../../assets/img/avatar-boy.png')
          }
        />
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text style={global.styles.blobText}>{userInfo.name}</Text>
          <Text style={styles.usernameText}>{userInfo.wtuUsername}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoDetailContainer}>
            <Text style={styles.labelText}>信誉分数: </Text>
            <Text style={{ color: getCreditColor() }}>{userInfo.credit}</Text>
          </View>
          <View style={styles.infoDetailContainer}>
            <Text style={styles.labelText}>居住寝室: </Text>
            <Text>{userInfo.bedroom}</Text>
          </View>
        </View>
      </BaseContainer>
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
            <Text style={global.styles.primaryTipText}>暂时没有记录哦!</Text>
          ) : null}
        </EnhancedLoadingView>
      </BaseContainer>
    </View>
  )
}
const styles = StyleSheet.create({
  avatar: {
    width: 64,
    height: 64,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  usernameText: {
    fontSize: 12,
  },
  infoContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoDetailContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    color: '#000',
  },
  recentActiveText: {
    color: '#000',
    fontSize: 16,
  },
  tipText: {
    fontSize: 12,
  },
})
export default UserInfoCard
