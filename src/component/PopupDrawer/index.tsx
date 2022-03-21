import React, { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import styles, { DRAWER_BAR_HEIGHT } from './styles'
import Icons from '../Icons'

interface PopupDrawerProps {
  drawer: React.ReactNode
  drawerTitle: string
  drawerContainerStyle?: StyleProp<ViewStyle>
}

const PopupDrawer: React.FC<PopupDrawerProps> = props => {
  const [drawerAvailableHeight, setDrawerAvailableHeight] = useState(0)
  // 至少滑动多长切换页面
  const TOGGLE_DISTANCE = 350
  // 速度至少为多少切换页面
  const TOGGLE_SPEED = 1
  // 用于还原drawer
  const drawerPos = useRef(new Animated.Value(0)).current
  const contentOpacity = useRef(new Animated.Value(1)).current
  // drawer的定位初始化距离
  const topPos = useRef(
    new Animated.Value(Dimensions.get('window').height)
  ).current
  // 触摸开始时的位置
  const startY = useRef(0)
  const startTime = useRef(0)
  // 是否正在显示课表
  const isShowingLessons = useRef(false)

  /**
   * 开始触摸, 记录触摸点
   */
  const onTouchStart = ({ nativeEvent }: GestureResponderEvent) => {
    drawerPos.stopAnimation()
    startY.current = nativeEvent.pageY
    startTime.current = nativeEvent.timestamp
  }

  const onTouchMove = ({ nativeEvent }: GestureResponderEvent) => {
    // 大于0为上滑, 小于0为下划
    const distance = startY.current - nativeEvent.pageY
    if (isShowingLessons.current) {
      drawerPos.setValue(-(drawerAvailableHeight + distance))
      const opacity = Math.abs(distance) / TOGGLE_DISTANCE
      contentOpacity.setValue(opacity > 1 ? 1 : opacity)
    } else {
      drawerPos.setValue(-distance)
      const opacity = 1 - Math.abs(distance) / TOGGLE_DISTANCE
      contentOpacity.setValue(opacity > 1 ? 1 : opacity)
    }
  }

  function hideDrawer() {
    drawerPos.stopAnimation()
    contentOpacity.stopAnimation()
    Animated.parallel([
      Animated.timing(drawerPos, {
        useNativeDriver: false,
        toValue: 0,
      }),
      Animated.timing(contentOpacity, {
        useNativeDriver: false,
        toValue: 1,
      }),
    ]).start()
  }

  function showDrawer() {
    drawerPos.stopAnimation()
    isShowingLessons.current = true
    Animated.timing(drawerPos, {
      useNativeDriver: false,
      toValue: -drawerAvailableHeight,
    }).start()
  }

  const onTouchEnd = ({ nativeEvent }: GestureResponderEvent) => {
    const distance = startY.current - nativeEvent.pageY

    const duration = nativeEvent.timestamp - startTime.current
    const speed = distance / duration

    if (speed < -TOGGLE_SPEED) {
      // 隐藏drawer
      isShowingLessons.current = false
      hideDrawer()
      return
    } else if (speed > TOGGLE_SPEED) {
      // 显示drawer
      isShowingLessons.current = true
      showDrawer()
      return
    }

    if (Math.abs(distance) < TOGGLE_DISTANCE) {
      if (isShowingLessons.current) {
        // TODO
        showDrawer()
      } else {
        // 还原隐藏状态
        hideDrawer()
      }
    } else {
      if (isShowingLessons.current) {
        // 隐藏drawer
        isShowingLessons.current = false
        hideDrawer()
      } else {
        // 显示drawer
        isShowingLessons.current = true
        showDrawer()
      }
    }
  }

  // useEffect(() => {
  //   console.log(`height: ${drawerAvailableHeight}`)
  //
  // }, [])

  const onDrawerLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    console.log('run')
    setDrawerAvailableHeight(nativeEvent.layout.height)
    Animated.timing(topPos, {
      toValue: nativeEvent.layout.height - DRAWER_BAR_HEIGHT,
      useNativeDriver: false,
    }).start()
  }
  return (
    <View style={styles.popupDrawerContainer}>
      <Animated.View
        style={{
          opacity: contentOpacity,
          transform: [{ scale: contentOpacity }],
        }}
        onLayout={onDrawerLayout}>
        {props.children}
      </Animated.View>
      <Animated.View
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={[
          styles.drawerContainerStyle,
          props.drawerContainerStyle,
          {
            top: topPos,
            transform: [{ translateY: drawerPos }],
          },
        ]}>
        <View style={styles.drawerBar}>
          <View style={styles.upIconsContainer}>
            <Icons iconText="&#xec0b;" />
          </View>
          <Text style={styles.drawerTableTitle}>{props.drawerTitle}</Text>
        </View>
        <View>{props.drawer}</View>
      </Animated.View>
    </View>
  )
}

export default PopupDrawer
