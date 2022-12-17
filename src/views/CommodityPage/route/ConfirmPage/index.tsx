import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native'

import { SpringScrollView } from 'react-native-spring-scrollview'
import {
  CommodityPageRouteTypes,
  CONFIRM_PAGE,
  LOCK_SUCCESS_PAGE,
} from '../../index'
import { getUserInfo, UserInfoView } from '../../../../api/server/user'
import Loading from '../../../../component/Loading'
import { lockCommodity } from '../../../../api/server/commodity'
import NativeDialog from '../../../../native/modules/NativeDialog'
import BaseContainer from '../../../../component/Container/BaseContainer'
import HorShopItem from '../../../CommodityListPage/component/HorShopItem'
import BaseContainer2 from '../../../../component/Container/BaseContainer2'
import EnhancedLoadingView from '../../../../component/Loading/EnhancedLoadingView'
import UserSimpleInfo from '../../../UserInfoPage/component/UserSimpleInfo'
import ColorfulButton from '../../../../component/Button/ColorfulButton'
import { NavigationProp } from '@react-navigation/core/src/types'
import CustomStatusBar from '../../../../component/Container/CustomStatusBar'

const ConfirmPage: React.FC = () => {
  const route =
    useRoute<RouteProp<CommodityPageRouteTypes, typeof CONFIRM_PAGE>>()
  const { commodity, remark, count } = route.params
  const [userInfo, setUserInfo] = useState<UserInfoView>()
  const nav = useNavigation<NavigationProp<CommodityPageRouteTypes>>()

  const loadUserInfo = () => getUserInfo(commodity.ownerId)

  const lock = () => {
    Loading.showLoading()
    lockCommodity(commodity.commodityId, count, route.params.remark)
      .then(result => {
        nav.dispatch(
          StackActions.replace(LOCK_SUCCESS_PAGE, {
            orderId: result.data,
            sellerId: commodity.ownerId,
          })
        )
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
      <CustomStatusBar backgroundColor={global.colors.boxBackgroundColor} />

      <SpringScrollView>
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
          <Text>{remark || '无备注...'}</Text>
        </BaseContainer2>
        <BaseContainer title="卖家信息">
          <EnhancedLoadingView loadData={loadUserInfo} setData={setUserInfo}>
            {userInfo ? <UserSimpleInfo userInfo={userInfo} /> : '用户不存在'}
          </EnhancedLoadingView>
        </BaseContainer>
        <View style={{ padding: 50 }} />
      </SpringScrollView>
      <View style={styles.bottomBar}>
        <View style={global.styles.flexRow}>
          <Text>价格: </Text>
          <Text style={styles.priceText}>
            {commodity.price * count}￥ ({count}件)
          </Text>
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
export default ConfirmPage
