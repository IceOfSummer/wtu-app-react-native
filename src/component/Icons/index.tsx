import React from 'react'
import { StyleSheet, Text } from 'react-native'

type Props = {
  focused?: boolean
  color?: string
  size?: number
  iconText: string
  onPress?: () => void
  style?: object
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
      style={{
        ...styles.iconfont,
        fontSize: props.size,
        color: props.color,
        ...props.style,
      }}>
      {props.iconText}
    </Text>
  )
}

export default Icons
