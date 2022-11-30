import React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  Text,
  View,
} from 'react-native'
import { createPropsGetter } from '../../utils/ObjectUtils'
import LoadingMore from './LoadingMore'
import RetryView from './RetryView'
import BounceScrollView from '../../native/component/BounceScrollView'
import CenterLoadingIndicator from './CenterLoadingIndicator'

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
  onRequireLoad?: () => void
  scrollViewProps?: ScrollViewProps
  loadingSkeleton?: React.ReactNode
  loading: boolean
  fail: boolean
  dataLength: number
  showLoadingMoreBtn?: boolean
  /**
   * 数据已经全部加载完毕
   */
  empty?: boolean
}
const getProps = createPropsGetter(defaultProps)
/**
 * 增强型ScrollView，当滚动到底部后自动加载数据
 *
 * 必须要提供loading, fail和dataLength(当前的数据长度)三种状态
 *
 * 如果没有更多数据了，将empty属性设置为true即可
 *
 * @deprecated
 * @see LoadingScrollView
 */
const EnhancedScrollView: React.FC<
  EnhancedScrollViewProps & Partial<typeof defaultProps>
> = props => {
  const { triggerBottomDis, dataLength } = getProps(props)
  const onScrollEvent = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (
      nativeEvent.contentSize.height -
        nativeEvent.layoutMeasurement.height -
        nativeEvent.contentOffset.y <=
      triggerBottomDis
    ) {
      if (!props.loading && !props.empty) {
        props.onScrollToBottom?.()
      }
    }
  }
  return (
    <BounceScrollView
      scrollConfig={{ onScroll: onScrollEvent, ...props.scrollViewProps }}>
      <View>{props.children}</View>
      {props.empty ? (
        <View>
          <Text style={global.styles.primaryTipText}>没有更多数据了...</Text>
        </View>
      ) : null}
      <View>
        {props.loading && dataLength === 0 ? (
          <CenterLoadingIndicator>
            {props.loadingSkeleton}
          </CenterLoadingIndicator>
        ) : null}
        <LoadingMore show={props.loading && dataLength > 0} />
        <RetryView
          onRetry={props.onRequireLoad}
          show={!props.loading && props.fail}
        />
      </View>
      <View style={{ paddingBottom: 50 }} />
    </BounceScrollView>
  )
}
EnhancedScrollView.defaultProps = defaultProps

export default EnhancedScrollView
