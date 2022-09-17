import React from 'react'
import { BaseButtonProps } from '../BaseButton'
import Button from 'react-native-button'
import { ColorValue, Text, View, ViewStyle } from 'react-native'

interface ColorfulButtonProps extends BaseButtonProps {
  color: ColorValue
  style?: ViewStyle
}

const ColorfulButton: React.FC<ColorfulButtonProps> = props => {
  return (
    <Button
      onPress={props.onPress}
      style={{
        overflow: 'hidden',
        borderRadius: 20,
        flex: 1,
        borderWidth: 1,
      }}
      containerStyle={[
        {
          overflow: 'hidden',
          backgroundColor: props.color,
          borderRadius: 20,
          justifyContent: 'center',
        },

        props.style,
      ]}>
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
          },
          props.containerStyle,
        ]}>
        <Text
          style={{
            textAlign: 'center',
            color: '#fff',
          }}>
          {props.title}
        </Text>
      </View>
    </Button>
  )
}

export default ColorfulButton
