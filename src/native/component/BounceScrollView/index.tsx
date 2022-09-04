import {
  requireNativeComponent,
  ScrollView,
  ScrollViewProps,
} from 'react-native'
import React, { useRef } from 'react'
import { finishFresh } from './commands'

interface RCTPullDownRefreshViewProps {
  onRefresh?: () => void
  enablePureScrollMode?: boolean
  enableRefresh?: boolean
}

const RCTPullDownRefreshView =
  requireNativeComponent<RCTPullDownRefreshViewProps>('RCTPullDownRefreshView')

interface BounceScrollViewProps {
  onRefresh?: (finish: finishRefresh) => void
  /**
   * 开启纯滑动模式, 开启后将关闭下拉刷新
   */
  enablePureScrollMode?: boolean
  /**
   * 是否开启下拉刷新, 默认为false, 推荐使用常量
   */
  enableRefresh?: boolean
  /**
   * 滚动条设置
   */
  scrollConfig?: ScrollViewProps
}

/**
 * 完成刷新, 传入true表示刷新成功, false表示失败
 */
export interface finishRefresh {
  (status?: boolean): void
}

/**
 * @param props
 * @constructor
 * @deprecated 使用react-native-spring-scrollview库 {@link https://bolan9999.github.io/react-native-spring-scrollview/#/}
 */
const BounceScrollView: React.FC<BounceScrollViewProps> = props => {
  const refreshViewRef = useRef(null)

  const onRefreshEvent = () => {
    if (props.onRefresh) {
      props.onRefresh(refreshCallback)
    }
  }

  const refreshCallback: finishRefresh = status => {
    finishFresh(refreshViewRef, status)
  }

  return (
    <RCTPullDownRefreshView
      {...props}
      onRefresh={onRefreshEvent}
      ref={refreshViewRef}>
      <ScrollView showsVerticalScrollIndicator={false} {...props.scrollConfig}>
        {props.children}
      </ScrollView>
    </RCTPullDownRefreshView>
  )
}

export default BounceScrollView
