import React from 'react'
import { LoadingFooter } from 'react-native-spring-scrollview'
import { View } from 'react-native'
import LottieView from 'lottie-react-native'

export default class LottieLoadingHeader extends LoadingFooter {
  static height = 100

  render() {
    if (this.state.status === 'allLoaded') {
      return null
    }
    const { offset, bottomOffset } = this.props
    let progress
    if (this.state.status === 'loading') {
      progress = undefined
    } else {
      progress = offset.interpolate({
        inputRange: [bottomOffset + 50, bottomOffset + 500],
        outputRange: [0, 1],
      })
    }
    return (
      <View style={{ flex: 1, marginBottom: 20 }}>
        <LottieView
          key={this.state.status}
          source={require('../../../assets/lottie/loading.json')}
          progress={progress}
          autoPlay={this.state.status === 'loading'}
          loop={this.state.status === 'loading'}
          speed={1}
        />
      </View>
    )
  }
}
