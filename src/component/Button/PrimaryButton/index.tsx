import React, { useRef } from 'react'
import { BaseButtonProps } from '../BaseButton'
import Button from 'react-native-button'
import { Animated, Text } from 'react-native'

const PrimaryButton: React.FC<BaseButtonProps> = props => {
  const backgroundAnim = useRef(new Animated.Value(0)).current

  backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(0, 122, 255)', 'rgba(0,122,255,0.75)'],
  })

  function onFocus() {
    console.log('focus')
    Animated.timing(backgroundAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start()
  }

  function onRelease() {
    console.log('release')
    Animated.timing(backgroundAnim, {
      toValue: 0,
      useNativeDriver: false,
    }).start()
  }

  return (
    <Button
      onPress={props.onPress}
      style={{ overflow: 'hidden', borderRadius: 20 }}
      containerStyle={{
        overflow: 'hidden',
        backgroundColor: global.styles.$primary_color,
        padding: 10,
        borderRadius: 20,
      }}
      onFocus={onFocus}
      onBlur={onRelease}>
      <Text style={{ textAlign: 'center', color: '#fff' }}>{props.title}</Text>
    </Button>
  )
}

export default PrimaryButton
