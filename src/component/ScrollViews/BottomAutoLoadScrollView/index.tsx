import React, { useRef, useState } from 'react'
import {
  ScrollEvent,
  SpringScrollView,
  SpringScrollViewPropType,
} from 'react-native-spring-scrollview'
import { Text } from 'react-native'

interface BottomAutoLoadScrollView extends SpringScrollViewPropType {
  /**
   * 有默认props，一定非空
   */
  loadDistance?: number
  loadCallback: () => Promise<unknown>
}

/**
 * 当距离底部一定距离时触发事件, onScroll和ref属性不可用
 */
const BottomAutoLoadScrollView: React.FC<BottomAutoLoadScrollView> = props => {
  const [loading, setLoading] = useState(false)
  const scroll = useRef<SpringScrollView>(null)
  const onScroll = (evt: ScrollEvent) => {
    if (props.allLoaded) {
      return
    }
    const scr = scroll.current
    if (!scr || loading) {
      return
    }
    const dis =
      scr._contentHeight - evt.nativeEvent.contentOffset.y - scr._height
    if (dis < props.loadDistance!) {
      setLoading(true)
      props.loadCallback().finally(() => {
        setLoading(false)
      })
    }
  }
  return (
    <SpringScrollView {...props} onScroll={onScroll} ref={scroll}>
      {props.children}
      {loading ? <Text style={global.styles.infoTipText}>加载中</Text> : null}
    </SpringScrollView>
  )
}

BottomAutoLoadScrollView.defaultProps = {
  loadDistance: 100,
}
export default BottomAutoLoadScrollView
