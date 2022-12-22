import React from 'react'
import ApplicationCard, { Application } from './ApplicationCard'
import { SCORE_QUERY, SUBJECT_SELECT_PAGE, WEB_PAGE } from '../../../router'
import { EduSystem, HealthReport } from '../../../views/Webpage'
import { View } from 'react-native'

/**
 * 教务系统相关应用
 */
const EDU_SYSTEM_APPLICATIONS: Array<Application> = [
  {
    path: SCORE_QUERY,
    image: require('../../../assets/img/scoreQuery.png'),
    title: '成绩查询',
    needLogin: true,
  },
  {
    path: SUBJECT_SELECT_PAGE,
    image: require('../../../assets/img/selectedLessons.png'),
    title: '选课工具',
    needLogin: true,
  },
  {
    path: WEB_PAGE,
    title: '登录教务系统',
    image: require('../../../assets/img/officialWeb.png'),
    routeParams: {
      url: EduSystem,
    },
    needLogin: true,
  },
  {
    path: WEB_PAGE,
    image: require('../../../assets/img/sign.png'),
    title: '健康打卡',
    needLogin: true,
    routeParams: {
      url: HealthReport,
    },
  },
]
/**
 * <b>已经与个人中心合并!<b/>
 * @constructor
 */
const Applications: React.FC = () => {
  return (
    <View>
      <ApplicationCard
        title="教务系统"
        applications={EDU_SYSTEM_APPLICATIONS}
      />
    </View>
  )
}

export default Applications
