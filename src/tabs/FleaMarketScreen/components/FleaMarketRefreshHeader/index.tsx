import React from 'react'
import { RefreshHeader } from 'react-native-spring-scrollview'
import { Text, View } from 'react-native'
import LottieView from 'lottie-react-native'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'

export default class FleaMarketRefreshHeader extends RefreshHeader {
  static height = 60

  static style = 'stickyContent'
  render() {
    let progress
    if (this.state.status === 'refreshing') {
      progress = undefined
    } else {
      progress = this.props.offset.interpolate({
        inputRange: [-FleaMarketRefreshHeader.height, -30],
        outputRange: [0, 0.5],
      })
    }
    return (
      <View style={{ width: '100%', height: 80 }}>
        <ConditionHideContainer hide={this.state.status !== 'pullingEnough'}>
          <Text style={global.styles.infoTipText}>松开刷新</Text>
        </ConditionHideContainer>
        <LottieView
          progress={progress}
          key={this.state.status}
          source={require('../../../../assets/lottie/loading2.json')}
          autoPlay={this.state.status === 'refreshing'}
          loop={this.state.status === 'refreshing'}
        />
      </View>
    )
  }
}
