import { Animated, View } from 'react-native'
import styles from './styles'
import React, { useEffect, useRef } from 'react'

const LoadingAnimation: React.FC = () => {
  const loading = useRef(new Animated.Value(0)).current

  const loadAni = Animated.parallel([
    Animated.timing(loading, {
      toValue: 360,
      useNativeDriver: true,
      duration: 1000,
    }),
  ])
  const ROTATE_MAP = loading.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  })

  useEffect(() => {
    const ani = Animated.loop(loadAni, {
      resetBeforeIteration: true,
    })
    ani.start()
    return () => {
      ani.stop()
    }
  }, [])

  return (
    <Animated.View
      style={[
        styles.loading,
        {
          transform: [
            {
              rotate: ROTATE_MAP,
            },
          ],
        },
      ]}>
      <View style={styles.item} />
    </Animated.View>
  )
}
export default LoadingAnimation
