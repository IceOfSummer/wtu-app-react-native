import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

type Props = {
  focused?: boolean
  color?: string
  size?: number
  iconText: string
  onPress?: () => void
  style?: StyleProp<TextStyle>
  /**
   * 是否主动解析Unicode字符串
   */
  parseUnicode?: boolean
}

const styles = StyleSheet.create({
  iconfont: {
    fontFamily: 'iconfont',
  },
})

const Icons: React.FC<Props> = props => {
  const unicodeToStr = (unicode: string) => {
    const hexStr = unicode.replace('&#x', '').replace(';', '')
    return String.fromCharCode(parseInt(hexStr, 16))
  }

  return (
    <Text
      onPress={props.onPress}
      style={[
        styles.iconfont,
        props.style,
        { fontSize: props.size, color: props.color },
      ]}>
      {props.parseUnicode ? unicodeToStr(props.iconText) : props.iconText}
    </Text>
  )
}

export default Icons
