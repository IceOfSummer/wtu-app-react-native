import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

type Props = {
  focused?: boolean
  color?: string
  size?: number
  iconText: string
  onPress?: () => void
  style?: StyleProp<TextStyle>
}

const styles = StyleSheet.create({
  iconfont: {
    fontFamily: 'iconfont',
  },
})

const Icons: React.FC<Props> = props => {
  return (
    <Text
      onPress={props.onPress}
      style={[
        styles.iconfont,
        props.style,
        { fontSize: props.size, color: props.color },
      ]}>
      {props.iconText}
    </Text>
  )
}

export default Icons
