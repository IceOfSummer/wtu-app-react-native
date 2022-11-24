import { ColorValue, StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { RouterTypes } from '../../router'

/**
 * 自动将状态栏设置为透明
 */
export default function (light?: boolean, color?: ColorValue) {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  nav.addListener('blur', () => {
    StatusBar.setBackgroundColor(global.colors.statusBarColor)
    if (light) {
      StatusBar.setBarStyle('dark-content')
    }
  })
  nav.addListener('focus', () => {
    StatusBar.setBackgroundColor(color ?? 'transparent')
    if (light) {
      StatusBar.setBarStyle('light-content')
    }
  })
}
