import React from 'react'
import {
  RefreshHeaderPropType,
  RefreshHeaderStateType,
  ScrollEvent,
  SpringScrollView,
} from 'react-native-spring-scrollview'
import RetryView from '../EnhancedScrollView/RetryView'
import { View } from 'react-native'
import InitSkeleton from './InitSkeleton'
import ConditionHideContainer from '../Container/ConditionHideContainer'
import LottieView from 'lottie-react-native'

interface LoadingScrollViewProps {
  /**
   * 当需要加载数据时
   */
  onRequireLoad: () => void
  empty: boolean
  loading: boolean
  error: boolean
  dataLength: number
  onRefresh?: () => void
  refreshHeader?: React.ComponentClass<
    RefreshHeaderPropType,
    RefreshHeaderStateType
  >
}

interface LoadingScrollViewState {
  loading: boolean
}

/**
 * 用于加载的容器，会自动显示加载骨架以及失败重试等操作。
 * <p>
 * 不负责渲染列表，请自己渲染。
 */
export class LoadingScrollView extends React.Component<
  LoadingScrollViewProps,
  LoadingScrollViewState
> {
  state: LoadingScrollViewState = {
    loading: false,
  }

  scroll = React.createRef<SpringScrollView>()

  public endLoading() {
    this.setState({ loading: false })
  }

  public endRefresh() {
    this.scroll.current?.endRefresh()
  }

  onScroll = (evt: ScrollEvent) => {
    if (this.state.loading || this.props.empty) {
      return
    }
    const scroll = this.scroll.current!
    const toBottomDis =
      scroll._contentHeight - evt.nativeEvent.contentOffset.y - scroll._height
    if (toBottomDis < 50) {
      // refresh
      this.setState({ loading: true })
      this.props.onRequireLoad()
    }
  }

  retry() {
    this.props.onRequireLoad()
  }

  constructor(props: LoadingScrollViewProps) {
    super(props)
    this.retry = this.retry.bind(this)
  }

  render() {
    return (
      <SpringScrollView
        onScroll={this.onScroll}
        onRefresh={this.props.onRefresh}
        ref={this.scroll}
        refreshHeader={this.props.refreshHeader}
        allLoaded={this.props.empty}>
        {this.props.children}
        {this.props.dataLength === 0 && this.props.loading ? (
          <Skeleton />
        ) : null}
        <RetryView
          onRetry={this.retry}
          show={!this.props.loading && this.props.error}
        />
        <ConditionHideContainer
          hide={!this.state.loading}
          style={{ width: '100%', height: 60 }}>
          <LottieView
            source={require('../../assets/lottie/loading.json')}
            loop
            autoPlay
          />
        </ConditionHideContainer>
      </SpringScrollView>
    )
  }
}

const Skeleton: React.FC = () => {
  return (
    <View>
      <InitSkeleton />
      <InitSkeleton />
      <InitSkeleton />
      <InitSkeleton />
      <InitSkeleton />
      <InitSkeleton />
    </View>
  )
}
