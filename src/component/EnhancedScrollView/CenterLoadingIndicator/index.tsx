import React from 'react'
import { StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native'

const CenterLoadingIndicator: React.FC = props => {
  return (
    <View>
      <View>{props.children}</View>
      <LottieView
        autoPlay
        source={require('../../../assets/lottie/loading.json')}
        style={styles.loadingIndicator}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  loadingIndicator: {
    width: 100,
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
  },
})
export default CenterLoadingIndicator
