import React, { useRef } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  LayoutChangeEvent,
  PanResponder,
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
  const drawerAvailableHeight = useRef(0)
  // 至少滑动多长切换页面
  const TOGGLE_DISTANCE = 350
  // 速度至少为多少切换页面
  const TOGGLE_SPEED = 1
  // drawer的位置
  const drawerPos = useRef(new Animated.Value(0)).current
  const contentOpacity = useRef(new Animated.Value(1)).current
  const bottomPadding = useRef(new Animated.Value(0)).current
  // 动画切换事件
  const DURATION = 200
  // drawer的定位初始化距离
  const topPos = useRef(
    new Animated.Value(Dimensions.get('window').height)
  ).current

  // 是否正在显示课表
  const isShowingLessons = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, state) => {
        const distance = -state.dy
        if (isShowingLessons.current) {
          drawerPos.setValue(-(drawerAvailableHeight.current + distance))
          const opacity = Math.abs(distance) / TOGGLE_DISTANCE / 2
          contentOpacity.setValue(opacity > 1 ? 1 : opacity)
          if (distance > 0) {
            // 设置下内边距, 防止滑出内容区
            bottomPadding.setValue(distance * 2)
          }
        } else {
          drawerPos.setValue(-distance)
          const opacity = 1 - Math.abs(distance) / TOGGLE_DISTANCE
          contentOpacity.setValue(opacity < 0 ? 0 : opacity)
        }
      },
      onPanResponderRelease: (event, state) => {
        // 正数向下滑动
        const distance = state.dy
        const speed = state.vy

        if (speed > TOGGLE_SPEED) {
          // 隐藏drawer
          isShowingLessons.current = false
          hideDrawer()
          return
        } else if (speed < -TOGGLE_SPEED) {
          // 显示drawer
          isShowingLessons.current = true
          showDrawer()
          return
        }

        if (Math.abs(distance) < TOGGLE_DISTANCE) {
          if (isShowingLessons.current) {
            showDrawer()
          } else {
            // 还原隐藏状态
            hideDrawer()
          }
        } else {
          if (isShowingLessons.current && distance > 0) {
            // 隐藏drawer
            isShowingLessons.current = false
            hideDrawer()
          } else {
            // 显示drawer
            isShowingLessons.current = true
            showDrawer()
          }
        }
      },
    })
  ).current

  function hideDrawer() {
    drawerPos.stopAnimation()
    contentOpacity.stopAnimation()
    Animated.parallel([
      Animated.timing(drawerPos, {
        useNativeDriver: false,
        toValue: 0,
        duration: DURATION,
        easing: Easing.linear,
      }),
      Animated.timing(contentOpacity, {
        useNativeDriver: false,
        toValue: 1,
        duration: DURATION,
      }),
    ]).start()
  }

  function showDrawer() {
    drawerPos.stopAnimation()
    isShowingLessons.current = true
    Animated.parallel([
      Animated.timing(drawerPos, {
        useNativeDriver: false,
        toValue: -drawerAvailableHeight.current,
        duration: DURATION,
        easing: Easing.linear,
      }),
      Animated.timing(contentOpacity, {
        useNativeDriver: false,
        toValue: 0,
        duration: DURATION,
      }),
      Animated.timing(bottomPadding, {
        useNativeDriver: false,
        toValue: 0,
        duration: DURATION,
      }),
    ]).start()
  }

  const onDrawerLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    drawerAvailableHeight.current = nativeEvent.layout.height
    Animated.timing(topPos, {
      toValue: nativeEvent.layout.height - DRAWER_BAR_HEIGHT,
      useNativeDriver: false,
    }).start()
    console.log('onload', nativeEvent.layout.height)
  }
  return (
    <View style={styles.popupDrawerContainer}>
      <Animated.View
        style={{
          opacity: contentOpacity,
        }}
        onLayout={onDrawerLayout}>
        {props.children}
      </Animated.View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.drawerContainerStyle,
          props.drawerContainerStyle,
          {
            top: topPos,
            transform: [{ translateY: drawerPos }],
            paddingBottom: bottomPadding,
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
