import { ColorValue } from 'react-native'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../redux/reducers'
import defaultTheme from './defaultTheme'
import { modifyCommonOptions } from '../../../redux/actions/commonOptions'

export interface ClassScheduleTheme {
  themeId: string
  color: ClassScheduleColors
  backgroundImage?: any
  classTableBackgroundImage?: any
}

export type ClassScheduleColors = {
  notStartedClass: ColorValue
  activeClass: ColorValue
  endedClass: ColorValue
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
