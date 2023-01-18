import { RefreshHeader } from 'react-native-spring-scrollview'
import { ActivityIndicator, Text, View } from 'react-native'
import React from 'react'

export default class SimpleLoadingHeader extends RefreshHeader {
  static height: number = 20

  render() {
    if (this.state.status === 'pullingEnough') {
      return <Text style={{ textAlign: 'center' }}>松开刷新</Text>
    }
    if (this.state.status === 'refreshing') {
      return (
        <View style={global.styles.flexRowCenter}>
          <ActivityIndicator color={global.colors.infoTextColor} />
          <Text>加载中...</Text>
        </View>
      )
    }
    return null
  }
}
