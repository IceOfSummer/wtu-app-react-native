import React from 'react'
import {
  Animated,
  Dimensions,
  EmitterSubscription,
  Keyboard,
  LayoutChangeEvent,
  Modal,
  Pressable,
  View,
  ViewStyle,
} from 'react-native'

interface DrawerComponentProps {
  style?: ViewStyle
}

interface DrawerComponentState {
  visible: boolean
  keyboardAvoidHeight: number
}

export default class Drawer extends React.Component<
  DrawerComponentProps,
  DrawerComponentState
> {
  state = {
    visible: false,
    keyboardAvoidHeight: 0,
  }

  screenHeight = Dimensions.get('window').height

  backgroundOpacity: Animated.Value

  modalOffset: Animated.Value

  contentHeight: number = 0

  isShowing: boolean = false

  public showDrawer() {
    this.setState(
      {
        visible: true,
      },
      () => {
        Animated.parallel([
          Animated.spring(this.modalOffset, {
            useNativeDriver: true,
            toValue: -this.contentHeight,
            bounciness: 0,
          }),
          Animated.spring(this.backgroundOpacity, {
            useNativeDriver: true,
            toValue: 1,
          }),
        ]).start(() => {
          this.isShowing = true
        })
      }
    )
  }

  public closeDrawer() {
    Animated.parallel([
      Animated.spring(this.modalOffset, {
        useNativeDriver: true,
        toValue: 0,
        bounciness: 0,
      }),
      Animated.spring(this.backgroundOpacity, {
        useNativeDriver: true,
        toValue: 0,
      }),
    ]).start()
    setTimeout(() => {
      this.setState({
        visible: false,
      })
      this.isShowing = false
    }, 200)
  }

  keyboardDidShowKey?: EmitterSubscription

  keyboardDidHideKey?: EmitterSubscription

  componentDidMount() {
    this.keyboardDidShowKey = Keyboard.addListener('keyboardDidShow', evt => {
      this.setState({
        keyboardAvoidHeight: evt.endCoordinates.height,
      })
    })
    this.keyboardDidHideKey = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({
        keyboardAvoidHeight: 0,
      })
    })
  }

  componentWillUnmount() {
    if (this.keyboardDidShowKey) {
      this.keyboardDidShowKey.remove()
    }
    if (this.keyboardDidHideKey) {
      this.keyboardDidHideKey.remove()
    }
  }

  onLayout({ nativeEvent }: LayoutChangeEvent) {
    if (this.isShowing) {
      Animated.spring(this.modalOffset, {
        useNativeDriver: true,
        toValue: -nativeEvent.layout.height,
        bounciness: 0,
      }).start()
    }
    this.contentHeight = nativeEvent.layout.height
  }

  constructor(props: DrawerComponentProps) {
    super(props)
    this.modalOffset = new Animated.Value(0)
    this.backgroundOpacity = new Animated.Value(1)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onLayout = this.onLayout.bind(this)
  }

  render() {
    return (
      <Modal statusBarTranslucent transparent visible={this.state.visible}>
        <Animated.View
          style={{
            flex: 1,
            paddingBottom: this.state.keyboardAvoidHeight,
            backgroundColor: global.styles.$bg_color_mask,
            opacity: this.backgroundOpacity,
          }}>
          <Pressable
            onPress={this.closeDrawer}
            style={{
              flex: 1,
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              top: this.screenHeight - this.state.keyboardAvoidHeight,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: global.colors.boxBackgroundColor,
              width: '100%',
              paddingBottom: 30,
              transform: [{ translateY: this.modalOffset }],
            }}>
            <View
              onLayout={this.onLayout}
              style={[this.props.style, { overflow: 'hidden' }]}>
              {this.props.children}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    )
  }
}
