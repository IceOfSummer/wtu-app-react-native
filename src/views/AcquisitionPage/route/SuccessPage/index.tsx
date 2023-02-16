import React, { useEffect, useRef } from 'react'
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import { FLEA_MARKET_TABS, HOME_TABS } from '../../../../router'
import { Text, View } from 'react-native'
import { AcquisitionSubmitPageRoute } from '../../index'

export const SuccessPage: React.FC = () => {
  const route =
    useRoute<
      RouteProp<AcquisitionSubmitPageRoute, '/acquisitionPage/submitSuccess'>
    >()
  const lottie = useRef<LottieView>(null)
  const nav = useNavigation()
  const toMainTab = () => {
    nav.dispatch(StackActions.replace(HOME_TABS, { screen: FLEA_MARKET_TABS }))
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
        收购请求提交成功
      </Text>
      <Text
        style={[
          global.styles.textContent,
          { color: global.colors.infoTextColor },
        ]}>
        您的商品是APP上第{route.params.acquisitionId}件商品
      </Text>
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
      </View>
    </View>
  )
}
