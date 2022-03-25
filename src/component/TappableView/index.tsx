import React, { useRef } from 'react'
import {
  GestureResponderEvent,
  PanResponder,
  View,
  ViewProps,
} from 'react-native'

interface TappableViewProps {
  onTap: (event: GestureResponderEvent) => void
}

/**
 * 可点击的View
 *
 * 提供专属的onTap事件处理点击事件，可以避免滑动事件而造成的误判断
 */
const TappableView: React.FC<ViewProps & TappableViewProps> = props => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy === 0) {
          // tap event
          props.onTap?.(event)
        }
      },
    })
  ).current

  return (
    <View {...props} {...panResponder.panHandlers}>
      {props.children}
    </View>
  )
}

export default TappableView
