import Icons from '../component/Icons'
import HomeScreen from './HomeScreen'
import ClassScheduleScreen from './ClassScheduleScreen'
import PersonalCenterScreen from './PersonalCenterScreen'
import React from 'react'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {
  CLASS_SCHEDULE_TABS,
  HOME_TABS,
  LESSONS_TABLE_CONFIG_PAGE,
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
            case PERSONAL_CENTER_TABS:
              return <Icons iconText="&#xe608;" {...param} />
            default:
              // home
              return <Icons iconText="&#xe613;" {...param} />
          }
        },
      })}>
      <Tab.Screen name="*" options={HOME_OPTIONS} component={HomeScreen} />
      <Tab.Screen
        name="课程表"
        component={ClassScheduleScreen}
        options={classScheduleOptions}
      />
      {/*ApplicationsScreen和PersonalCenterScreen合并了*/}
      <Tab.Screen
        name={PERSONAL_CENTER_TABS}
        component={PersonalCenterScreen}
        options={PERSONAL_CENTER_SCREEN_OPTIONS}
      />
    </Tab.Navigator>
  )
}

const HOME_OPTIONS: BottomTabNavigationOptions = {
  header: () => null,
  tabBarLabel: '首页',
}

const classScheduleOptions = (nav: any): BottomTabNavigationOptions => ({
  tabBarLabel: '课程表',
  headerTitleAlign: 'center',
  headerRight: () => (
    <Icons
      iconText="&#xe600;"
      size={20}
      style={{ marginRight: 10 }}
      onPress={() => {
        nav.navigation.navigate(LESSONS_TABLE_CONFIG_PAGE)
      }}
    />
  ),
})
const PERSONAL_CENTER_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  header: () => null,
  tabBarLabel: '个人中心',
}
export default TabBar
