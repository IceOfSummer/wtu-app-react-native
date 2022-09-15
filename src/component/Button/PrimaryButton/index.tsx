import React from 'react'
import { BaseButtonProps } from '../BaseButton'
import Button from 'react-native-button'
import { Text, View } from 'react-native'

const PrimaryButton: React.FC<BaseButtonProps> = props => {
  return (
    <Button
      onPress={props.onPress}
      style={{
        overflow: 'hidden',
        borderRadius: 20,
        flex: 1,
      }}
      containerStyle={{
        flex: 1,
        overflow: 'hidden',
        backgroundColor: global.styles.$primary_color,
        borderRadius: 20,
      }}>
      <View
        style={[
          { paddingHorizontal: 20, paddingVertical: 6 },
          props.containerStyle,
        ]}>
        <Text style={{ textAlign: 'center', color: '#fff' }}>
          {props.title}
        </Text>
      </View>
    </Button>
  )
}

export default PrimaryButton
