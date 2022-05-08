import React from 'react'
import { BaseButtonProps } from '../BaseButton'
import Button from 'react-native-button'
import { Text } from 'react-native'

const PrimaryButton: React.FC<BaseButtonProps> = props => {
  return (
    <Button
      onPress={props.onPress}
      style={{
        overflow: 'hidden',
        borderRadius: 20,
        paddingHorizontal: 20,
        margin: 20,
      }}
      containerStyle={{
        overflow: 'hidden',
        backgroundColor: global.styles.$primary_color,
        padding: 10,
        marginVertical: 20,
        marginHorizontal: 30,
        borderRadius: 20,
      }}>
      <Text style={{ textAlign: 'center', color: '#fff' }}>{props.title}</Text>
    </Button>
  )
}

export default PrimaryButton
