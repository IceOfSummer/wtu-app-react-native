import React, { useEffect, useRef } from 'react'
import { Text, View } from 'react-native'
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { SubmitPageRouteTypes, SUCCESS_PAGE } from '../../index'
import LottieView from 'lottie-react-native'
import {
  COMMODITY_DETAIL_PAGE,
  FLEA_MARKET_TABS,
  HOME_TABS,
} from '../../../../router'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'

const SubmitSuccessPage: React.FC = () => {
  const route = useRoute<RouteProp<SubmitPageRouteTypes, typeof SUCCESS_PAGE>>()
  const lottie = useRef<LottieView>(null)
  const nav = useNavigation()
  const email = useSelector<ReducerTypes, string | undefined>(
    state => state.serverUser.userInfo?.email
  )

  const toMainTab = () => {
    nav.dispatch(StackActions.replace(HOME_TABS, { screen: FLEA_MARKET_TABS }))
  }

  const checkGoods = () => {
    nav.dispatch(
      StackActions.replace(COMMODITY_DETAIL_PAGE, {
        id: route.params.commodityId,
      })
    )
  }

  useEffect(() => {
    lottie.current?.play()
  }, [])
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20 }}>
      <LottieView
        style={{ height: 300 }}
        loop={false}
        ref={lottie}
        source={require('../../../../assets/lottie/success.json')}
      />
      <Text
        style={{
          ...global.styles.primaryTipText,
          color: global.colors.success_color,
        }}>
        商品提交成功
      </Text>
      <Text style={global.styles.textContent}>
        图片资源由于需要一定的时间进行处理，因此可能无法正常显示
      </Text>
      <Text
        style={[
          global.styles.textContent,
          { color: global.colors.infoTextColor },
        ]}>
        您的商品是APP上第{route.params.commodityId}件商品
      </Text>
      {email ? null : (
        <Text style={global.styles.errorTipText}>
          检测到您还未绑定邮箱，在商品被购买时可能不会即使收到通知，请及时绑定邮箱！
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Text
          onPress={toMainTab}
          style={[
            global.styles.primaryTipText,
            { marginHorizontal: global.styles.$spacing_row_base },
          ]}>
          回到主页
        </Text>
        <Text
          onPress={checkGoods}
          style={[
            global.styles.primaryTipText,
            { marginHorizontal: global.styles.$spacing_row_base },
          ]}>
          查看商品
        </Text>
      </View>
    </View>
  )
}

export default SubmitSuccessPage
