import { ColorValue, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { RouterTypes } from '../../router'
import { useEffect } from 'react'

type Config = {
  color?: ColorValue
  translucent?: boolean
  light?: boolean
}

interface AutoColorStatusBar {
  (light?: boolean, color?: ColorValue): void
  (config: Config): void
}
/**
 * 控制某些<b>永远不会被卸载的组件</b>界面的状态栏.
 *
 * 无法动态调整相关属性, 仅第一次传入时的有效!
 */
const useAutoColorStatusBar: AutoColorStatusBar = (arg1, arg2?): void => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  let config: Config
  if (typeof arg1 === 'object') {
    config = arg1
  } else {
    config = {
      color: arg2 as string,
    }
  }
  useEffect(() => {
    nav.addListener('focus', () => {
      if (config.translucent) {
        StatusBar.setTranslucent(true)
        StatusBar.setBackgroundColor('transparent')
      } else {
        StatusBar.setTranslucent(false)
        StatusBar.setBackgroundColor(config.color ?? 'transparent')
      }
      StatusBar.setBarStyle(config.light ? 'light-content' : 'dark-content')
    })
  }, [])
}
export default useAutoColorStatusBar
