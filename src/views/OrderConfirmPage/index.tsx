import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { ORDER_CONFIRM_PAGE, UseRouteGeneric } from '../../router'
import BaseContainer from '../../component/Container/BaseContainer'
import HorShopItem from '../CommodityListPage/component/HorShopItem'
import BaseContainer2 from '../../component/Container/BaseContainer2'
import UserSimpleInfo from '../UserInfoPage/component/UserSimpleInfo'
import EnhancedLoadingView from '../../component/Loading/EnhancedLoadingView'
import { getUserInfo, UserInfoView } from '../../api/server/user'
import ColorfulButton from '../../component/Button/ColorfulButton'
import BounceScrollView from '../../native/component/BounceScrollView'
import { lockCommodity } from '../../api/server/commodity'
import Loading from '../../component/Loading'
import NativeDialog from '../../native/modules/NativeDialog'

const OrderConfirmPage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof ORDER_CONFIRM_PAGE>>()
  const { commodity } = route.params
  const [userInfo, setUserInfo] = useState<UserInfoView>()

  const loadUserInfo = () => getUserInfo(commodity.ownerId)

  const lock = () => {
    Loading.showLoading()
    lockCommodity(commodity.commodityId, route.params.remark)
      .then(resp => {
        // TODO 锁定成功, 跳转到订单记录页面
        console.log(resp)
      })
      .catch(e => {
        NativeDialog.showDialog({
          title: '锁定失败',
          message: e.message,
          hideCancelBtn: true,
        })
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }
  return (
    <View style={{ flex: 1 }}>
      <BounceScrollView>
        <BaseContainer title="商品信息">
          <HorShopItem
            id={commodity.commodityId}
            name={commodity.name}
            createTime={Number.parseInt(commodity.createTime, 10)}
            price={commodity.price}
            image={commodity.previewImage}
            tradeLocation={commodity.tradeLocation}
          />
        </BaseContainer>
        <BaseContainer2 title="备注信息">
          <Text>{route.params.remark ? route.params.remark : '无备注...'}</Text>
        </BaseContainer2>
        <BaseContainer title="卖家信息">
          <EnhancedLoadingView loadData={loadUserInfo} setData={setUserInfo}>
            {userInfo ? <UserSimpleInfo userInfo={userInfo} /> : '用户不存在'}
          </EnhancedLoadingView>
        </BaseContainer>
        <View style={{ padding: 50 }} />
      </BounceScrollView>
      <View style={styles.bottomBar}>
        <View style={global.styles.flexRow}>
          <Text>价格: </Text>
          <Text style={styles.priceText}>{commodity.price}￥</Text>
        </View>
        <ColorfulButton
          onPress={lock}
          color={global.styles.$primary_color}
          title="锁定并通知卖家"
          style={{ marginHorizontal: 6 }}
          containerStyle={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  priceText: {
    color: 'red',
    fontSize: 20,
  },
  button: {
    paddingHorizontal: 40,
  },
})
export default OrderConfirmPage
