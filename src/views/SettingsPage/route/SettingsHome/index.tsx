import React from 'react'
import NavigationCard from '../../../../component/Cards/NavigationCard'
import CardContainer from '../../../../component/Cards/CardContainer'
import {
  ABOUT_PAGE,
  LESSONS_TABLE_SETTINGS_PAGE,
  USER_SETTINGS_PAGE,
} from '../../index'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'

const SettingsHome: React.FC = () => {
  const auth = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
  return (
    <CardContainer>
      <NavigationCard title="课程表设置" to={LESSONS_TABLE_SETTINGS_PAGE} />
      {auth ? (
        <NavigationCard title="用户设置" to={USER_SETTINGS_PAGE} />
      ) : null}
      <NavigationCard title="关于" to={ABOUT_PAGE} hideBorder />
    </CardContainer>
  )
}

export default SettingsHome
