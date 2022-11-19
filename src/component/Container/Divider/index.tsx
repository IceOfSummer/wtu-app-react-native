import React from 'react'
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

interface DividerProps {
  width?: number | string
  color?: ColorValue
  style?: StyleProp<ViewStyle>
}

const Divider: React.FC<DividerProps> = props => {
  return (
    <View
      style={[
        {
          width: props.width,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: props.color,
          alignSelf: 'center',
        },
        props.style,
      ]}
    />
  )
}

Divider.defaultProps = {
  width: '100%',
  color: global.colors.borderColor,
}

export default Divider
