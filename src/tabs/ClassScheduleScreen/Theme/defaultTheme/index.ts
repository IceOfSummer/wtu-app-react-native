import { ClassScheduleTheme } from '../index'

/**
 * 默认主题
 * 朴实无华~
 */
const defaultTheme: ClassScheduleTheme = {
  themeId: 'defaultTheme',
  name: '默认主题',
  description: '朴实无华~',
  textColor: undefined,
  infoTextColor: undefined,
  classLabel: {
    color: {
      activeClass: 'skyblue',
      endedClass: global.styles.$info_color,
      notStartedClass: global.styles.$success_color,
    },
  },
  background: {
    color: undefined,
  },
  classLabelBackground: {
    color: '#fff',
  },
}

export default defaultTheme
