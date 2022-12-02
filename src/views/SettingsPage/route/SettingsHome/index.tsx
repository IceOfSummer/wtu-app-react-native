import React from 'react'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import CardContainer from '../../../../component/Cards/CardContainer'
import { ABOUT_PAGE, LESSONS_TABLE_SETTINGS_PAGE } from '../../index'

const SettingsHome: React.FC = () => {
  return (
    <CardContainer>
      <NavigationCard title="课程表设置" to={LESSONS_TABLE_SETTINGS_PAGE} />
      <NavigationCard title="关于" to={ABOUT_PAGE} hideBorder />
    </CardContainer>
  )
}

export default SettingsHome
