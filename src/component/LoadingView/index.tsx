import React, { ReactElement, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

interface LoadingViewProps {
  /**
   * 加载数据的回调
   * @return 数据是否加载成功
   */
  loadCallback: () => Promise<boolean>
  skeleton?: ReactElement
}

/**
 * 用于包含需要动态加载的内容，当加装失败后自动显示重试按钮
 */
const LoadingView: React.FC<LoadingViewProps> = props => {
  const [success, setSuccess] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const loadData = () => {
    setLoading(true)
    props
      .loadCallback()
      .then(status => {
        setSuccess(status)
      })
      .catch(() => {
        setSuccess(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <View>
      {isLoading ? <View>{props.skeleton}</View> : null}
      {success && !isLoading ? <View>{props.children}</View> : null}
      {!success ? <FailView onRetryPress={loadData} /> : null}
    </View>
  )
}
interface FailViewProps {
  onRetryPress: () => void
}
const FailView: React.FC<FailViewProps> = props => {
  return (
    <Pressable onPress={props.onRetryPress}>
      <Text style={global.styles.errorTipText}>加载失败, 点我重试</Text>
    </Pressable>
  )
}

export default LoadingView
