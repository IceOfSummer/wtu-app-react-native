import React from 'react'
import {
  Animated,
  LayoutChangeEvent,
  Modal,
  Pressable,
  View,
} from 'react-native'

interface DrawerProps {
  drawerRef?: React.RefObject<DrawerComponent>
}

interface DrawerState {
  height?: number
}

/**
 * 提供高度自适应的DrawerComponent组件
 *
 * 子组件会被额外渲染一次用来策略高度，若子组件会动态更新，则不能使用该组件
 */
export default class Drawer extends React.Component<DrawerProps, DrawerState> {
  state = {
    height: undefined,
  }

  onMenuLayout({ nativeEvent }: LayoutChangeEvent) {
    this.setState({ height: nativeEvent.layout.height })
  }

  constructor(props: DrawerProps) {
    super(props)
    this.onMenuLayout = this.onMenuLayout.bind(this)
  }

  render() {
    const { height } = this.state
    return (
      <View>
        {height ? (
          <DrawerComponent
            {...this.props}
            height={height}
            ref={this.props.drawerRef}>
            {this.props.children}
          </DrawerComponent>
        ) : (
          <View
            onLayout={this.onMenuLayout}
            style={{ position: 'absolute', opacity: 0 }}>
            {this.props.children}
          </View>
        )}
      </View>
    )
  }
}

interface DrawerComponentProps {
  height: number
}

interface DrawerComponentState {
  visible: boolean
  maskVisible: boolean
}

export class DrawerComponent extends React.Component<
  DrawerComponentProps,
  DrawerComponentState
> {
  state = {
    visible: false,
    maskVisible: true,
  }

  modalOffset: Animated.Value

  public openDrawer() {
    this.modalOffset.setValue(this.props.height)
    this.setState(
      {
        visible: true,
        maskVisible: true,
      },
      () => {
        Animated.spring(this.modalOffset, {
          useNativeDriver: true,
          toValue: 0,
          bounciness: 0,
        }).start()
      }
    )
  }

  public closeDrawer() {
    this.setState({
      maskVisible: false,
    })
    Animated.spring(this.modalOffset, {
      useNativeDriver: true,
      toValue: this.props.height,
      bounciness: 0,
    }).start()
    // 不能等动画放完再结束，不然mask已经消失了但用户仍然点击不了屏幕
    setTimeout(() => {
      this.setState({
        visible: false,
      })
    }, 150)
  }

  constructor(props: DrawerComponentProps) {
    super(props)
    this.modalOffset = new Animated.Value(props.height)
    this.closeDrawer = this.closeDrawer.bind(this)
  }

  render() {
    return (
      <Modal statusBarTranslucent transparent visible={this.state.visible}>
        <Pressable
          onPress={this.closeDrawer}
          style={{
            backgroundColor: this.state.maskVisible
              ? global.styles.$bg_color_mask
              : undefined,
            flex: 1,
          }}>
          <Animated.View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: global.colors.boxBackgroundColor,
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: this.props.height,
              transform: [{ translateY: this.modalOffset }],
            }}>
            {this.props.children}
          </Animated.View>
        </Pressable>
      </Modal>
    )
  }
}
