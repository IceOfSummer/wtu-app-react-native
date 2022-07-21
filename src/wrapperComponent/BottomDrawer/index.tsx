import React, { useImperativeHandle, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Pressable,
  StatusBar,
  StatusBarProps,
  StyleSheet,
  View,
} from 'react-native'
import { OpenDrawerParam } from '../index'
import { OnRef } from '../../component/types'

const styles = StyleSheet.create({
  bottomMenuOuter: {
    position: 'absolute',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  modal: {
    position: 'absolute',
  },
})

interface BottomDrawerProps {
  param?: OpenDrawerParam
}

export interface BottomDrawerRefAttribute {
  openDrawer: () => void
  closeDrawer: () => void
}

const PreCheckContainer: React.FC<
  BottomDrawerProps & OnRef<BottomDrawerRefAttribute>
> = props => {
  if (props.param) {
    return <BottomDrawer {...props} />
  } else {
    return null
  }
}

/**
 * 从底部出现的抽屉<p/>
 * <b>一定要先测量好contentHeight后，再打开抽屉</b>
 */
const BottomDrawer: React.FC<
  BottomDrawerProps & OnRef<BottomDrawerRefAttribute>
> = props => {
  // @see PreCheckContainer
  const param = props.param!!
  const [open, setOpen] = useState(false)
  const screenHeight = Dimensions.get('screen').height
  const containerBottomValue = useRef(new Animated.Value(0)).current
  const ANIMATION_DURATION = 200
  const [modalColor, setModalColor] = useState(global.styles.$loading_bg_color)
  const statusBarEntry = useRef<StatusBarProps>()

  const openDrawer = () => {
    setOpen(true)
    containerBottomValue.setValue(param.height)
    statusBarEntry.current = StatusBar.pushStackEntry({
      backgroundColor: global.styles.$loading_bg_color,
    })
    Animated.timing(containerBottomValue, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start()
  }

  const closeDrawer = () => {
    setModalColor('#ffffff00')
    if (statusBarEntry.current) {
      StatusBar.popStackEntry(statusBarEntry.current)
    }
    Animated.timing(containerBottomValue, {
      toValue: param.height,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false)
      setModalColor(global.styles.$loading_bg_color)
    })
  }

  useImperativeHandle<unknown, BottomDrawerRefAttribute>(props.onRef, () => ({
    openDrawer,
    closeDrawer,
  }))

  return (
    <View
      style={[
        styles.modal,
        {
          height: '100%',
          width: '100%',
          backgroundColor: modalColor,
          top: open ? 0 : screenHeight,
        },
      ]}>
      <Pressable onPress={() => closeDrawer()} style={{ flex: 1 }}>
        <Animated.View
          style={[
            styles.bottomMenuOuter,
            { bottom: 0, transform: [{ translateY: containerBottomValue }] },
          ]}>
          {param.node}
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default React.forwardRef<BottomDrawerRefAttribute, BottomDrawerProps>(
  (props, ref) => {
    return <PreCheckContainer {...props} onRef={ref} />
  }
)
