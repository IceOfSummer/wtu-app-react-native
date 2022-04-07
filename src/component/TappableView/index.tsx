import React, { useRef } from 'react'
import { GestureResponderEvent, View, ViewProps } from 'react-native'

interface TappableViewProps {
  onPress?: (event: GestureResponderEvent) => void
}

/**
 * 可点击的View
 * 提供专属的onTap事件处理点击事件，可以避免滑动事件而造成的误判断
 *
 * @see Pressable 推荐使用官方自带的组件, 若无效可尝试本组件
 *
 * 一般在父组件使用了PanResponder后, Pressable组件可能会失效
 */
const TappableView: React.FC<ViewProps & TappableViewProps> = props => {
  const startY = useRef(0)

  const onTouchStart = ({ nativeEvent }: GestureResponderEvent) => {
    startY.current = nativeEvent.pageY
  }

  const onTouchEnd = (event: GestureResponderEvent) => {
    const { nativeEvent } = event
    if (nativeEvent.pageY - startY.current === 0) {
      props.onPress?.(event)
    }
  }

  return (
    <View {...props} onTouchEnd={onTouchEnd} onTouchStart={onTouchStart}>
      {props.children}
    </View>
  )
}

export default TappableView
