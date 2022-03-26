import React from 'react'
import BounceScrollView from '../../native/component/BounceScrollView'
import ApplicationCard, { Application } from './ApplicationCard'
import { EMPTY_PAGE } from '../../router'

const Applications: React.FC = () => {
  /**
   * 教务系统相关应用
   */
  const EDU_SYSTEM_APPLICATIONS: Array<Application> = [
    {
      path: EMPTY_PAGE,
      image: require('../../assets/img/officialWeb.png'),
      title: '登录教务系统',
    },
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

  /**
   * 推荐应用
   */
  const SUGGEST_APPLICATION: Array<Application> = [
    {
      path: EMPTY_PAGE,
      image: require('../../assets/img/trade.png'),
      title: '跳蚤市场',
    },
    {
      path: EMPTY_PAGE,
      image: require('../../assets/img/message.png'),
      title: '意见反馈',
    },
  ]

  return (
    <BounceScrollView enablePureScrollMode={true}>
      <ApplicationCard
        title="教务系统"
        applications={EDU_SYSTEM_APPLICATIONS}
      />
      <ApplicationCard title="推荐应用" applications={SUGGEST_APPLICATION} />
    </BounceScrollView>
  )
}

export default Applications
