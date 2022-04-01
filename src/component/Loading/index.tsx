import React from 'react'
import { ActivityIndicator, StatusBar, Text, View } from 'react-native'
import styles from './styles'

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
    StatusBar.setBackgroundColor('#00000080')
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
    StatusBar.setBackgroundColor('#fff')
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
    if (this.state.show) {
      return (
        <View style={styles.loadMask}>
          <ActivityIndicator
            size="large"
            color={global.styles.$primary_color}
          />
          <Text style={styles.loadingText}>{this.state.loadingText}</Text>
        </View>
      )
    } else {
      return null
    }
  }
}
