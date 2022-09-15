import React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { createPropsGetter } from '../../utils/ObjectUtils'

const defaultProps = {
  /**
   * 距离底部多远时触发事件
   */
  triggerBottomDis: 30,
}

interface EnhancedScrollViewProps {
  /**
   * 当滚动条滑到底部时触发回调
   */
  onScrollToBottom?: () => void
}
const getProps = createPropsGetter(defaultProps)
/**
 * 增强型ScrollView
 */
const EnhancedScrollView: React.FC<
  EnhancedScrollViewProps & Partial<typeof defaultProps>
> = props => {
  const { triggerBottomDis } = getProps(props)
  const onScrollEvent = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (
      nativeEvent.contentSize.height -
        nativeEvent.layoutMeasurement.height -
        nativeEvent.contentOffset.y <=
      triggerBottomDis
    ) {
      props.onScrollToBottom?.()
    }
  }
  return <ScrollView onScroll={onScrollEvent}>{props.children}</ScrollView>
}
EnhancedScrollView.defaultProps = defaultProps

export default EnhancedScrollView
