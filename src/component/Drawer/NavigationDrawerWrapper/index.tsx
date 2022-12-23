import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import {
  Animated,
  Dimensions,
  Keyboard,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

const NavigationDrawerWrapper: React.FC = props => {
  const navigation = useNavigation<NavigationProp<any>>()
  const { colors } = useTheme()
  const deviceHeight = Dimensions.get('window').height
  const transY = useRef(new Animated.Value(0)).current
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    Animated.spring(transY, {
      toValue: -nativeEvent.layout.height,
      useNativeDriver: true,
      speed: 18,
      bounciness: 0,
    }).start()
  }
  useEffect(() => {
    const beforeRemoveCb = () => {
      Animated.spring(transY, {
        toValue: 0,
        speed: 18,
        useNativeDriver: true,
        bounciness: 0,
      }).start()
    }
    navigation.addListener('beforeRemove', beforeRemoveCb)
    const key1 = Keyboard.addListener('keyboardDidShow', evt => {
      setKeyboardHeight(evt.endCoordinates.height)
    })
    const key2 = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0)
    })
    return () => {
      navigation.removeListener('beforeRemove', beforeRemoveCb)
      key1.remove()
      key2.remove()
    }
  }, [])
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Pressable
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute' },
        ]}
        onPress={navigation.goBack}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: deviceHeight - keyboardHeight,
          width: '100%',
          borderTopRightRadius: 18,
          borderTopLeftRadius: 18,
          paddingBottom: 50,
          backgroundColor: colors.card,
          transform: [{ translateY: transY }],
        }}>
        <View onLayout={onLayout}>{props.children}</View>
      </Animated.View>
    </View>
  )
}

export default NavigationDrawerWrapper
