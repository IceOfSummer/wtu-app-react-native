import React from 'react'
import {
  RefreshHeaderPropType,
  RefreshHeaderStateType,
  ScrollEvent,
  SpringScrollView,
} from 'react-native-spring-scrollview'
import RetryView from '../EnhancedScrollView/RetryView'
import { Text, View } from 'react-native'
import InitSkeleton from './InitSkeleton'
import ConditionHideContainer from '../Container/ConditionHideContainer'
import LottieView from 'lottie-react-native'

interface LoadingScrollViewProps {
  /**
   * 当需要加载数据时(上滑时加载)，若返回值为void，需要手动调用{@link LoadingScrollView#endLoading}方法，否则刷新动画不会终止
   * <p>
   * 若返回promise，则会自动调用终止方法，但在发生错误时，该组件不会有额外的行为，
   * 需要自己进行处理，比如设置{@link LoadingScrollViewProps#error}属性为`true`。
   */
  onRequireLoad: () => void | Promise<unknown>
  empty: boolean
  /**
   * @deprecated
   */
  loading?: boolean
  error: boolean
  dataLength: number
  onRefresh?: () => void
  refreshHeader?: React.ComponentClass<
    RefreshHeaderPropType,
    RefreshHeaderStateType
  >
  showEmptyTip?: boolean
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
    if (toBottomDis < 50 && !this.props.error && !this.state.loading) {
      // loading
      this.setState({ loading: true })
      this.loadMoreData()
    }
  }

  private loadMoreData() {
    const returnVal = this.props.onRequireLoad()
    if (typeof returnVal === 'object') {
      // promise
      returnVal.finally(() => {
        this.endLoading()
      })
    }
  }

  constructor(props: LoadingScrollViewProps) {
    super(props)
    this.loadMoreData = this.loadMoreData.bind(this)
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
          onRetry={this.loadMoreData}
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
        <ConditionHideContainer hide={!this.props.showEmptyTip}>
          <Text style={global.styles.infoTipText}>到底了哦!</Text>
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
