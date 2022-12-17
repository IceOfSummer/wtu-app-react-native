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
} from '../router'
import FleaMarketScreen from './FleaMarketScreen'
import MessageScreen from './MessageScreen'
import pubsub from 'pubsub-js'
import { useNavigation } from '@react-navigation/native'
import { FunctionArgType } from '../hook/useNav'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../redux/counter'
import DatabaseManager from '../sqlite'
import { initMessage } from '../redux/counter/messageSlice'
import NativeDialog from '../native/modules/NativeDialog'
import { CONFIRM_PAGE } from '../views/CommodityPage'
import { LESSONS_TABLE_SETTINGS_PAGE } from '../views/SettingsPage'
import NavigationHeader from '../component/Container/NavigationHeader'

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
  const uid = useSelector<ReducerTypes, number | undefined>(
    state => state.serverUser.userInfo?.uid
  )
  const dispatch = useDispatch()
  useEffect(() => {
    if (!uid) {
      return
    }
    DatabaseManager.loadDatabase(uid)
      .then(() => {
        // initMessage
        dispatch(initMessage())
      })
      .catch(e => {
        // 加载失败
        NativeDialog.showDialog({
          title: '加载本地消息失败',
          message: '请寻求开发人员帮助或者稍后重试, ' + e.message,
          hideCancelBtn: true,
        })
      })
  }, [uid])

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
  headerShown: false,
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
      backgroundColor={global.colors.boxBackgroundColor}
      headerRight={() => (
        <Icons
          iconText="&#xe600;"
          size={20}
          style={{ marginRight: 10 }}
          onPress={() => {
            nav.navigation.navigate(CONFIRM_PAGE, {
              screen: LESSONS_TABLE_SETTINGS_PAGE,
            })
          }}
        />
      )}
    />
  ),
})
const PERSONAL_CENTER_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarLabel: '个人中心',
}

export default TabBar
