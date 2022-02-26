import Icons from '../component/Icons'
import HomeScreen from './HomeScreen'
import ClassScheduleScreen from './ClassScheduleScreen'
import ApplicationsScreen from './ApplicationsScreen'
import PersonalCenterScreen from './PersonalCenterScreen'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useStore } from 'react-redux'
import {
  APPLICATIONS_TABS,
  CLASS_SCHEDULE_TABS,
  HOME_TABS,
  PERSONAL_CENTER_TABS,
} from '../router'

const Tab = createBottomTabNavigator()

const TabBar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: param => {
          switch (route.name) {
            case HOME_TABS:
              return <Icons iconText="&#xe613;" {...param} />
            case CLASS_SCHEDULE_TABS:
              return <Icons iconText="&#xe62c;" {...param} />
            case APPLICATIONS_TABS:
              return <Icons iconText="&#xe603;" {...param} />
            case PERSONAL_CENTER_TABS:
              return <Icons iconText="&#xe608;" {...param} />
            default:
              // home
              return <Icons iconText="&#xe613;" {...param} />
          }
        },
        header: () => {
          return null
        },
      })}>
      <Tab.Screen
        name="*"
        options={{ title: HOME_TABS }}
        component={HomeScreen}
      />
      <Tab.Screen name={CLASS_SCHEDULE_TABS} component={ClassScheduleScreen} />
      <Tab.Screen name={APPLICATIONS_TABS} component={ApplicationsScreen} />
      <Tab.Screen
        name={PERSONAL_CENTER_TABS}
        component={PersonalCenterScreen}
      />
    </Tab.Navigator>
  )
}

export default TabBar
