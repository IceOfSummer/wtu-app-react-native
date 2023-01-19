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
  MESSAGE_TABS,
  PERSONAL_CENTER_TABS,
  RouterTypes,
  SETTINGS_PAGE,
} from '../router'
import FleaMarketScreen from './FleaMarketScreen'
import MessageScreen from './MessageScreen'
import pubsub from 'pubsub-js'
import { useNavigation } from '@react-navigation/native'
import { FunctionArgType } from '../hook/useNav'
import { LESSONS_TABLE_SETTINGS_PAGE } from '../views/SettingsPage'
import NavigationHeader from '../component/Container/NavigationHeader'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../redux/counter'
import { TradeStat } from '../api/server/stat'

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
  const remindCount = useSelector<ReducerTypes, number>(
    state => state.eventRemind.sumUnreadCount
  )
  const messageCount = useSelector<ReducerTypes, number>(
    state => state.message.unreadCount
  )
  const tradeStat = useSelector<ReducerTypes, TradeStat | undefined>(
    state => state.temporary.tradeStat
  )

  const sumTipCount = remindCount + messageCount
  const personalCenterTip = tradeStat
    ? tradeStat.receiveCount + tradeStat.deliveryCount
    : undefined
  useEffect(() => {
    pubsub.subscribe(NAVIGATION_EVENT_KEY, (message, data: Nav) => {
      // 在非组件内进行路由操作
      nav.navigate(data.path, data.param)
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
        options={{
          ...messageOptions,
          tabBarBadge: sumTipCount || undefined,
        }}
      />
      <Tab.Screen
        name={PERSONAL_CENTER_TABS}
        component={PersonalCenterScreen}
        options={{
          ...PERSONAL_CENTER_SCREEN_OPTIONS,
          tabBarBadge: personalCenterTip || undefined,
        }}
      />
    </Tab.Navigator>
  )
}

const messageOptions: BottomTabNavigationOptions = {
  tabBarLabel: '消息',
  title: '消息',
  headerShown: false,
  tabBarBadgeStyle: { backgroundColor: 'red' },
}

const fleaMarketOptions: BottomTabNavigationOptions = {
  tabBarLabel: '跳蚤市场',
  title: '跳蚤市场',
  headerShown: false,
}

const HOME_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarLabel: '广场',
}

const classScheduleOptions = (nav: any): BottomTabNavigationOptions => ({
  tabBarLabel: '课程表',
  header: props => (
    <NavigationHeader
      {...props}
      title="课程表"
      hideBackButton
      showSplitLine
      backgroundColor={global.colors.boxBackgroundColor}>
      <Icons
        iconText="&#xe600;"
        size={24}
        style={{ marginRight: 10 }}
        onPress={() => {
          nav.navigation.navigate(SETTINGS_PAGE, {
            screen: LESSONS_TABLE_SETTINGS_PAGE,
          })
        }}
      />
    </NavigationHeader>
  ),
})
const PERSONAL_CENTER_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarLabel: '个人中心',
  tabBarBadgeStyle: { backgroundColor: 'red' },
}

export default TabBar
