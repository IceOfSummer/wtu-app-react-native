import { NativeModules, Platform } from 'react-native'

interface PickDialogMethod {
  showPicker: (config: PickDialogConfig) => void
}
type PickDialogConfig = {
  title: string
  recipes: string[]
  onSelect: (index: number) => void
  /**
   * 起始位置，会自动与recipes中寻找对应的值，若设置activeIndex则会忽略该值
   */
  defaultActive?: string
  /**
   * 默认起始索引
   */
  activeIndex?: number
}
/**
 * 对应原生方法
 */
interface NativePickDialogMethod {
  showPicker: (
    title: string,
    recipes: string[],
    defaultActive: number,
    onSelect: (index: number) => void
  ) => void
}

const PickDialog: PickDialogMethod = (function () {
  let dialog: PickDialogMethod
  if (Platform.OS === 'android') {
    const NativePickDialog =
      NativeModules.RNMPickerDialog as unknown as NativePickDialogMethod
    dialog = {
      showPicker: config => {
        let activeIndex = 0
        if (config.activeIndex) {
          activeIndex = config.activeIndex
        } else if (config.defaultActive) {
          for (let i = 0, len = config.recipes.length; i < len; i++) {
            if (config.recipes[i] === config.defaultActive) {
              activeIndex = i
              break
            }
          }
        }
        NativePickDialog.showPicker(
          config.title,
          config.recipes,
          activeIndex,
          config.onSelect
        )
      },
    }
  } else {
    // TODO 兼容ios
    dialog = {
      showPicker() {},
    }
  }
  return dialog
})()

export default PickDialog
