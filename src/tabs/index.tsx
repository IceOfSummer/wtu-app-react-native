import Icons from '../component/Icons'
import HomeScreen from './HomeScreen'
import ClassScheduleScreen from './ClassScheduleScreen'
import PersonalCenterScreen from './PersonalCenterScreen'
import React, { useEffect } from 'react'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {
  CLASS_SCHEDULE_TABS,
  FLEA_MARKET_TABS,
  HOME_TABS,
  LESSONS_TABLE_CONFIG_PAGE,
  MESSAGE_TABS,
  PERSONAL_CENTER_TABS,
  RouterTypes,
} from '../router'
import FleaMarketScreen from './FleaMarketScreen'
import MessageScreen from './MessageScreen'
import pubsub from 'pubsub-js'
import { useNavigation } from '@react-navigation/native'
import { FunctionArgType } from '../hook/useNav'

const Tab = createBottomTabNavigator()

const NAVIGATION_EVENT_KEY = 'navigation'

type Nav = {
  path: string
  param: any
}

/**
 * 在非组件中进行路由push操作
 * @param args
 */
export const navigationPush = <RouteName extends keyof RouterTypes>(
  ...args: FunctionArgType<RouteName>
) => {
  pubsub.publish(NAVIGATION_EVENT_KEY, { path: args[0], param: args[1] })
}

const TabBar = () => {
  const nav = useNavigation<any>()
  useEffect(() => {
    pubsub.subscribe(NAVIGATION_EVENT_KEY, (message, data: Nav) => {
      // 在非组件内进行路由操作
      nav.navigate(data.path, data.path)
    })
  }, [])
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
            case FLEA_MARKET_TABS:
              return <Icons iconText="&#xe67f;" {...param} />
            case MESSAGE_TABS:
              return <Icons iconText="&#xe619;" {...param} />
            default:
              // home
              return <Icons iconText="&#xe613;" {...param} />
          }
        },
      })}>
      <Tab.Screen name="*" options={HOME_OPTIONS} component={HomeScreen} />
      <Tab.Screen
        name={CLASS_SCHEDULE_TABS}
        component={ClassScheduleScreen}
        options={classScheduleOptions}
      />
      <Tab.Screen
        name={FLEA_MARKET_TABS}
        component={FleaMarketScreen}
        options={fleaMarketOptions}
      />
      <Tab.Screen
        name={MESSAGE_TABS}
        component={MessageScreen}
        options={messageOptions}
      />
      <Tab.Screen
        name={PERSONAL_CENTER_TABS}
        component={PersonalCenterScreen}
        options={PERSONAL_CENTER_SCREEN_OPTIONS}
      />
    </Tab.Navigator>
  )
}

const messageOptions: BottomTabNavigationOptions = {
  tabBarLabel: '聊天',
  title: '聊天',
  header: () => null,
}

const fleaMarketOptions: BottomTabNavigationOptions = {
  tabBarLabel: '跳蚤市场',
  title: '跳蚤市场',
  header: () => null,
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
