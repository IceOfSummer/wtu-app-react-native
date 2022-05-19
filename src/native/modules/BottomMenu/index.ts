import { NativeModules, Platform } from 'react-native'

interface NativeBottomMenuMethod {
  showMenu: (
    recipes: string[],
    onFinish: (index?: number, name?: string) => void
  ) => void
}

interface AndroidNativeBottomMenuTypes {
  showMenu: (
    recipes: string[],
    onFinish: (index?: number, name?: string) => void
  ) => void
}

/**
 * export default
 */
let BottomMenu: NativeBottomMenuMethod

if (Platform.OS === 'android') {
  const NativeBottomMenu =
    NativeModules.RNMBottomMenu as unknown as AndroidNativeBottomMenuTypes
  BottomMenu = {
    showMenu(recipes, onFinish) {
      NativeBottomMenu.showMenu(recipes, onFinish)
    },
  }
} else {
  // ios
  BottomMenu = {
    showMenu() {
      console.error('BottomMenu is not implement on IOS')
    },
  }
}
export default BottomMenu
