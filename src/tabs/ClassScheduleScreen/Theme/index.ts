import { ColorValue } from 'react-native'
import { useStore } from 'react-redux'
import { modifyCommonOptions } from '../../../redux/counter/commonOptionsSlice'
import defaultTheme from './defaultTheme'
import { ReducerTypes } from '../../../redux/counter'

export interface ClassScheduleTheme {
  themeId: string
  name: string
  description?: string
  infoTextColor?: ColorValue
  textColor?: ColorValue
  /**
   * 课程卡片是否使用图片
   */
  classLabel: ThemeConfig<
    ClassLabelTemplate<ColorValue>,
    ClassLabelTemplate<any>
  >
  /**
   * 课程表背景
   */
  background: ThemeConfig
  /**
   * 课程表详细页面背景
   */
  classLabelBackground: ThemeConfig
}

type ThemeConfig<C = ColorValue, I = any> = {
  useImage?: boolean
  color?: C
  image?: I
}

type ClassLabelTemplate<T> = {
  notStartedClass: T
  activeClass: T
  endedClass: T
}

interface useClassScheduleThemeHook {
  (): useClassScheduleThemeHookReturnType
}
type useClassScheduleThemeHookReturnType = {
  getTheme: () => ClassScheduleTheme
  setTheme: (theme: ClassScheduleTheme) => void
}

export const useClassScheduleTheme: useClassScheduleThemeHook = () => {
  const store = useStore<ReducerTypes>()
  const curTheme = store.getState().commonOptions.activeClassScheduleTheme
  return {
    getTheme() {
      return curTheme ? curTheme : defaultTheme
    },
    setTheme(theme) {
      store.dispatch(
        modifyCommonOptions({
          activeClassScheduleTheme: theme,
        })
      )
    },
  }
}
