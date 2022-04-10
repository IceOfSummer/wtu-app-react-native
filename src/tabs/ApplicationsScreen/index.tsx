import React from 'react'
import BounceScrollView from '../../native/component/BounceScrollView'
import ApplicationCard, { Application } from './ApplicationCard'
import { EMPTY_PAGE, WEB_PAGE } from '../../router'
import { EduSystem, FeedbackPage, HealthReport } from '../../views/Webpage'

const Applications: React.FC = () => {
  /**
   * 教务系统相关应用
   */
  const loginEduSystem: Application<typeof WEB_PAGE> = {
    path: WEB_PAGE,
    title: '登录教务系统',
    image: require('../../assets/img/officialWeb.png'),
    routeParams: {
      url: EduSystem,
    },
  }
  const EDU_SYSTEM_APPLICATIONS: Array<Application> = [
    {
      path: EMPTY_PAGE,
      image: require('../../assets/img/scoreQuery.png'),
      title: '成绩查询',
    },
    {
      path: EMPTY_PAGE,
      image: require('../../assets/img/selectedLessons.png'),
      title: '选课工具',
    },
  ]
  EDU_SYSTEM_APPLICATIONS.push(loginEduSystem)

  /**
   * ==========================================
   * 推荐应用
   */
  const feedback: Application<typeof WEB_PAGE> = {
    path: WEB_PAGE,
    image: require('../../assets/img/message.png'),
    title: '意见反馈',
    routeParams: {
      url: FeedbackPage,
    },
  }
  const SUGGEST_APPLICATION: Array<Application> = [
    {
      path: EMPTY_PAGE,
      image: require('../../assets/img/trade.png'),
      title: '跳蚤市场',
      routeParams: {},
    },
    feedback,
  ]

  /**
   * 其它应用
   */
  const signPage: Application<typeof WEB_PAGE> = {
    path: WEB_PAGE,
    image: require('../../assets/img/sign.png'),
    title: '健康打卡',
    routeParams: {
      url: HealthReport,
    },
  }

  const OTHER_APPLICATION: Array<Application> = [signPage]

  return (
    <BounceScrollView enablePureScrollMode={true}>
      <ApplicationCard
        title="教务系统"
        applications={EDU_SYSTEM_APPLICATIONS}
      />
      <ApplicationCard title="推荐应用" applications={SUGGEST_APPLICATION} />
      <ApplicationCard title="其它" applications={OTHER_APPLICATION} />
    </BounceScrollView>
  )
}

export default Applications
