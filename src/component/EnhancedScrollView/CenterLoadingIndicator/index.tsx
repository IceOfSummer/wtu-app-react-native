import React from 'react'
import { ColorValue, StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native'

interface CenterLoadingIndicatorProps {
  backgroundColor?: ColorValue
}

const CenterLoadingIndicator: React.FC<CenterLoadingIndicatorProps> = props => {
  return (
    <View>
      <View>{props.children}</View>
      <LottieView
        autoPlay
        source={require('../../../assets/lottie/loading.json')}
        style={[
          styles.loadingIndicator,
          { backgroundColor: props.backgroundColor },
        ]}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  loadingIndicator: {
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
    height: 60,
  },
})
export default CenterLoadingIndicator
