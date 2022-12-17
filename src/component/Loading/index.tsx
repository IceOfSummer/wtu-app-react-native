import React from 'react'
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'

interface LoadingStates {
  loadingText: string
  show?: boolean
}

export default class Loading extends React.Component<any, LoadingStates> {
  state = {
    loadingText: '加载中',
    show: false,
  }

  private static curInstance: Loading | null = null

  constructor(props: any) {
    super(props)
    if (Loading.curInstance) {
      console.log('repeat')
    }
    Loading.curInstance = this
  }

  componentWillUnmount() {
    Loading.curInstance = null
  }

  /**
   * 显示加载条
   * @param loadingText 提示文字
   */
  public static showLoading(loadingText: string = '加载中'): void {
    if (!Loading.curInstance) {
      console.warn(
        'No <Loading/> instance found, please create it on the root tag'
      )
      return
    }
    Loading.curInstance.setState({
      loadingText,
      show: true,
    })
  }

  /**
   * 隐藏加载条
   */
  public static hideLoading(): void {
    if (!Loading.curInstance) {
      console.warn(
        'No <Loading/> instance found, please create it on the root tag'
      )
      return
    }
    Loading.curInstance.setState({
      show: false,
    })
  }

  render() {
    return (
      <Modal visible={this.state.show} transparent statusBarTranslucent>
        <View style={styles.loadMask}>
          <ActivityIndicator
            size="large"
            color={global.styles.$primary_color}
          />
          <Text style={styles.loadingText}>{this.state.loadingText}</Text>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  loadMask: {
    backgroundColor: '#00000040',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
})
