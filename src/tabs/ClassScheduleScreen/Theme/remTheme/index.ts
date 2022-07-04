import { ClassScheduleTheme } from '../index'

/**
 * <b>蕾姆主题</b>
 * 如果真爱有颜色, 那一定是蓝色!
 */
const remTheme: ClassScheduleTheme = {
  themeId: 'remTheme',
  name: '蕾姆主题',
  description: '如果真爱有颜色, 那一定是蓝色!!',
  infoTextColor: 'gold',
  textColor: '#dc348c',
  classLabel: {
    useImage: true,
    image: {
      activeClass: require('../../../../assets/img/remActive.jpg'),
      notStartedClass: require('../../../../assets/img/remNotStarted.jpg'),
      endedClass: require('../../../../assets/img/remEnded.jpg'),
    },
  },
  background: {
    useImage: true,
    color: '#fff',
    image: require('../../../../assets/img/rem.jpg'),
  },
  classLabelBackground: {
    useImage: true,
    color: '#fff',
    image: require('../../../../assets/img/remBg.jpg'),
  },
}

export default remTheme
