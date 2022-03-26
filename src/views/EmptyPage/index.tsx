import React from 'react'
import { Text, View } from 'react-native'

const EmptyPage: React.FC = () => {
  return (
    <View>
      <Text
        style={{ color: global.styles.$primary_color, textAlign: 'center' }}>
        页面正在建设中~
      </Text>
    </View>
  )
}

export default EmptyPage
