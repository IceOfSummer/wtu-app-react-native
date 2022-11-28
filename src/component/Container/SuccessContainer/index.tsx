import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import LottieView from 'lottie-react-native'

/**
 * 成功页面的容器
 */
const SuccessContainer: React.FC = props => {
  const lottie = useRef<LottieView>(null)
  useEffect(() => {
    lottie.current?.play()
  }, [])
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <LottieView
        style={{ height: 300 }}
        loop={false}
        ref={lottie}
        source={require('../../../assets/lottie/success.json')}
      />
      {props.children}
    </View>
  )
}

export default SuccessContainer
