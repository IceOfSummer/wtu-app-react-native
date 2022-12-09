import { Pressable, Text, View, ViewStyle } from 'react-native'
import React from 'react'

export interface BaseContainerProps {
  borderRadius?: number
  padding?: number
  innerPadding?: number
  style?: ViewStyle
  darkBackground?: boolean
  title?: string
  onPress?: () => void
}

/**
 * 简单的容器
 * 可以用于快速设置内边距与角弧度
 */
const BaseContainer: React.FC<BaseContainerProps> = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        paddingHorizontal: global.util.assert(
          props.padding,
          global.styles.$spacing_row_sm
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
            padding: props.innerPadding ?? 8,
          },
          props.style,
        ]}>
        {props.title ? (
          <Text
            style={{
              marginLeft: 4,
              color: global.styles.$text_color,
              fontSize: 16,
            }}>
            {props.title}
          </Text>
        ) : null}
        {props.children}
      </View>
    </Pressable>
  )
}

export default BaseContainer
