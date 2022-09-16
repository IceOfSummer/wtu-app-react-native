import React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { createPropsGetter } from '../../utils/ObjectUtils'
import LoadingMore from './LoadingMore'
import RetryView from './RetryView'
import BounceScrollView from '../../native/component/BounceScrollView'
import LottieView from 'lottie-react-native'

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
 * 增强型ScrollView
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
          <LoadingIndicator>{props.loadingSkeleton}</LoadingIndicator>
        ) : null}
        <LoadingMore show={props.loading && dataLength > 0} />
        <RetryView onRetry={props.onRequireLoad} show={props.fail} />
      </View>
      <View style={{ paddingBottom: 50 }} />
    </BounceScrollView>
  )
}
EnhancedScrollView.defaultProps = defaultProps
const LoadingIndicator: React.FC = props => {
  return (
    <View>
      <View>{props.children}</View>
      <LottieView
        autoPlay
        source={require('./LoadingMore/loading.json')}
        style={styles.loadingIndicator}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  loadingIndicator: {
    width: 100,
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
  },
})
export default EnhancedScrollView
