import { Text, View, ViewStyle } from 'react-native'
import React from 'react'

interface BaseContainerProps {
  borderRadius?: number
  padding?: number
  innerPadding?: number
  style?: ViewStyle
  darkBackground?: boolean
  title?: string
}

/**
 * 简单的容器
 * 可以用于快速设置内边距与角弧度
 */
const BaseContainer: React.FC<BaseContainerProps> = props => {
  return (
    <View
      style={{
        paddingHorizontal: global.util.assert(
          props.padding,
          global.styles.$spacing_row_base
        ),
        marginVertical: 4,
      }}>
      <View
        style={[
          {
            backgroundColor: props.darkBackground
              ? 'rgb(242, 243, 247)'
              : global.styles.$bg_color,
            borderRadius: global.util.assert(props.borderRadius, 10),
            padding: global.util.assert(props.innerPadding, 8),
          },
          props.style,
        ]}>
        <Text
          style={{
            marginLeft: 4,
            color: global.styles.$text_color,
            fontSize: 16,
          }}>
          {props.title}
        </Text>
        {props.children}
      </View>
    </View>
  )
}

export default BaseContainer
