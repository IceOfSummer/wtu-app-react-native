import React from 'react'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { modifyOptions } from '../../redux/actions/lessonsTable'
import { ABOUT_PAGE, LESSONS_TABLE_CONFIG_PAGE } from '../../router'
import CardContainer from '../../component/Cards/CardContainer'
import NavigationCard from '../../component/Cards/NavigationCard'

interface SettingsPageProps {}

const SettingsPage: React.FC<
  SettingsPageProps & StoreStates & StoreActions
> = () => {
  return (
    <CardContainer>
      <NavigationCard title="课程表设置" to={LESSONS_TABLE_CONFIG_PAGE} />
      <NavigationCard title="关于" hideBorder to={ABOUT_PAGE} />
    </CardContainer>
  )
}

interface StoreStates {}

interface StoreActions {
  modifyLessonsTableConfig: (...args: Parameters<typeof modifyOptions>) => void
}

export default connect<
  StoreStates,
  StoreActions,
  SettingsPageProps,
  ReducerTypes
>(() => ({}), {
  modifyLessonsTableConfig: modifyOptions,
})(SettingsPage)
