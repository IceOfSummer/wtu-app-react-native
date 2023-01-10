import React, { useEffect } from 'react'
import SuccessContainer from '../../../../component/Container/SuccessContainer'
import { Text, View } from 'react-native'
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { CommodityPageRouteTypes, LOCK_SUCCESS_PAGE } from '../../index'
import {
  CHAT_PAGE,
  FLEA_MARKET_TABS,
  HOME_TABS,
  RouterTypes,
} from '../../../../router'
import { NavigationProp } from '@react-navigation/core/src/types'
import { modifyKVData } from '../../../../redux/counter/temporaryDataSlice'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'

const LockSuccessPage: React.FC = () => {
  const route =
    useRoute<RouteProp<CommodityPageRouteTypes, typeof LOCK_SUCCESS_PAGE>>()
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  const store = useStore<ReducerTypes>()
  const backToHome = () => {
    nav.dispatch(StackActions.replace(HOME_TABS, { screen: FLEA_MARKET_TABS }))
  }

  const talkToSeller = () => {
    nav.dispatch(StackActions.replace(CHAT_PAGE, { screen: FLEA_MARKET_TABS }))
  }

  useEffect(() => {
    const stat = store.getState().temporary.tradeStat
    store.dispatch(
      modifyKVData({
        tradeStat: {
          receiveCount: stat.receiveCount + 1,
          deliveryCount: stat.deliveryCount,
        },
      })
    )
  }, [])

  return (
    <SuccessContainer>
      <Text style={global.styles.successTipText}>商品锁定成功</Text>
      <Text style={global.styles.textContent}>
        我们将会自动通知卖家，您也可以主动与卖家联系
      </Text>
      <Text
        style={{
          ...global.styles.textContent,
          color: global.styles.$info_color,
        }}>
        该订单是APP上第{route.params.orderId}个订单
      </Text>
      <View style={global.styles.flexRowCenter}>
        <Text
          style={[global.styles.primaryTipText, { marginHorizontal: 8 }]}
          onPress={backToHome}>
          回到首页
        </Text>
        <Text
          style={[global.styles.primaryTipText, { marginHorizontal: 8 }]}
          onPress={talkToSeller}>
          联系卖家
        </Text>
      </View>
    </SuccessContainer>
  )
}

export default LockSuccessPage
