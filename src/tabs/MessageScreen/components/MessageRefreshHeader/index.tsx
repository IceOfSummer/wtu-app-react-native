import { RefreshHeader } from 'react-native-spring-scrollview'
import LottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'
export default class MessageRefreshHeader extends RefreshHeader {
  static height = 100

  render() {
    let progress
    if (this.state.status === 'refreshing') {
      progress = undefined
    } else {
      progress = this.props.offset.interpolate({
        inputRange: [-150, -30],
        outputRange: [1, 0],
      })
    }
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <LottieView
          progress={progress}
          key={this.state.status}
          source={require('../../../../assets/lottie/message.json')}
          autoPlay={this.state.status === 'refreshing'}
          loop={this.state.status === 'refreshing'}
        />
      </View>
    )
  }
}
