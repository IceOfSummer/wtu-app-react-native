import React from 'react'
import LottieView from 'lottie-react-native'
import { Pressable, View } from 'react-native'

interface CenterBannerProps {
  onGoButtonPress: () => void
}

const CenterBanner: React.FC<CenterBannerProps> = props => {
  return (
    <View style={{ position: 'relative', marginVertical: -15 }}>
      <LottieView
        source={require('../../lottie/jump.json')}
        autoPlay
        style={{ width: '100%' }}
      />
      <Pressable
        onPress={props.onGoButtonPress}
        style={{
          position: 'absolute',
          top: '21%',
          left: '5%',
          height: '57%',
          width: '89%',
        }}
      />
    </View>
  )
}
export default CenterBanner
