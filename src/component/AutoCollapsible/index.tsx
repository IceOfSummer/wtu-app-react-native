import React, { useEffect, useRef, useState } from 'react'
import Collapsible from 'react-native-collapsible'
import { Animated, Pressable, Text, View } from 'react-native'
import styles from './styles'
import Icons from '../Icons'

interface AutoCollapsibleProps<D> {
  headerText: string
  onOpen?: (data?: D) => void
  onFirstOpen?: (data?: D) => void
  data?: D
  children?: any
}

function AutoCollapsible<D>(props: AutoCollapsibleProps<D>) {
  const [hide, setHide] = useState(true)
  const TO_UP_ARROW_ANIMATION = 0
  const TO_DOWN_ARROW_ANIMATION = 1
  const rotate = useRef(new Animated.Value(TO_UP_ARROW_ANIMATION)).current
  const isOpened = useRef(false)

  useEffect(() => {
    if (hide) {
      Animated.timing(rotate, {
        toValue: TO_UP_ARROW_ANIMATION,
        useNativeDriver: false,
      }).start()
    } else {
      if (!isOpened.current) {
        isOpened.current = true
        props.onFirstOpen?.(props.data)
      }
      props.onOpen?.(props.data)
      Animated.timing(rotate, {
        toValue: TO_DOWN_ARROW_ANIMATION,
        useNativeDriver: false,
      }).start()
    }
  }, [hide])

  return (
    <View style={styles.outer}>
      <Pressable style={styles.container} onPress={() => setHide(!hide)}>
        <View style={styles.headerContainer}>
          <Text style={{ color: global.styles.$primary_color }}>
            {props.headerText}
          </Text>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotate.interpolate({
                    inputRange: [
                      TO_UP_ARROW_ANIMATION,
                      TO_DOWN_ARROW_ANIMATION,
                    ],
                    outputRange: ['0deg', '-180deg'],
                  }),
                },
              ],
            }}>
            <Icons iconText="&#xe6b9;" size={20} />
          </Animated.View>
        </View>
        <Collapsible collapsed={hide}>{props.children}</Collapsible>
      </Pressable>
    </View>
  )
}

export default AutoCollapsible
