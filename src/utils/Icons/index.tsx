import React from 'react'
import { StyleSheet, Text } from 'react-native'

type Props = {
  focused?: boolean
  color?: string
  size?: number
  iconText: string
}
interface BaseIcon extends React.FC<Props> {}

const styles = StyleSheet.create({
  iconfont: {
    fontFamily: 'iconfont',
  },
})

const Icons: BaseIcon = props => {
  return (
    <Text
      style={{ ...styles.iconfont, fontSize: props.size, color: props.color }}>
      {props.iconText}
    </Text>
  )
}

export default Icons
