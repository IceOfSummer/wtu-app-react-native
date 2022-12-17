import React from 'react'
import { ColorValue, StyleSheet, View } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

interface CustomStatusBarProps {
  backgroundColor?: ColorValue
}

/**
 * 状态栏的占位
 */
const CustomStatusBar: React.FC<CustomStatusBarProps> = props => {
  return (
    <View
      style={[style.statusbar, { backgroundColor: props.backgroundColor }]}
    />
  )
}

const style = StyleSheet.create({
  statusbar: {
    width: '100%',
    height: getStatusBarHeight(),
  },
})

export default CustomStatusBar
