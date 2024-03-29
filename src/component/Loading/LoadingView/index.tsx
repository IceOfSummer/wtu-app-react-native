import React, { ReactElement } from 'react'
import { ColorValue, View, ViewStyle } from 'react-native'
import RetryView from '../../EnhancedScrollView/RetryView'
import CenterLoadingIndicator from '../../EnhancedScrollView/CenterLoadingIndicator'

interface LoadingViewProps {
  /**
   * 加载数据的回调
   * @return 数据是否加载成功
   */
  loadCallback: () => void
  skeleton?: ReactElement
  success: boolean
  isLoading: boolean
  style?: ViewStyle
  backgroundColor?: ColorValue
}

/**
 * 用于包含需要动态加载的内容，当加装失败后自动显示重试按钮
 */
const LoadingView: React.FC<LoadingViewProps> = props => {
  return (
    <View style={props.style}>
      {props.isLoading ? (
        <CenterLoadingIndicator backgroundColor={props.backgroundColor} />
      ) : null}
      {props.success && !props.isLoading ? <View>{props.children}</View> : null}
      {!props.success && !props.isLoading ? (
        <RetryView onRetry={props.loadCallback} show />
      ) : null}
    </View>
  )
}

export default LoadingView
