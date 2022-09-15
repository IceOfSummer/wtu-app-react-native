import React from 'react'
import { Text, View } from 'react-native'
import LottieView from 'lottie-react-native'

interface LoadingMoreProps {
  show?: boolean
}

const LoadingMore: React.FC<LoadingMoreProps> = props => {
  if (props.show) {
    return (
      <View style={{ alignItems: 'center' }}>
        <LottieView
          source={require('./loading.json')}
          autoPlay
          style={{ width: 100 }}
        />
        <Text style={[global.styles.primaryTipText, { marginTop: -20 }]}>
          加载中
        </Text>
      </View>
    )
  }
  return null
}

export default LoadingMore
