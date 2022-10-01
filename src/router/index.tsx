import React, { useEffect } from 'react'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import TabBar from '../tabs'
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native'
import PersonalInfo from '../views/PersonalInfo'
import DiyToast from '../component/DiyToast/NavToast'
import { StatusBar } from 'react-native'
import LessonsTableConfigPage from '../views/LessonsTableConfigPage'
import LessonsDetail from '../views/LessonsDetail'
import EmptyPage from '../views/EmptyPage'
import SettingsPage from '../views/SettingsPage'
import AboutPage from '../views/AboutPage'
import defaultTheme from './Theme/defaultTheme'
import { updateCurWeek } from '../redux/actions/lessonsTable'
import Webpage from '../views/Webpage'
import ScoreQueryPage from '../views/ScoreQueryPage'
import { checkLogin } from '../redux/actions/user'
import { markCheckLoginDone } from '../redux/actions/temporaryData'
import { ReducerTypes } from '../redux/reducers'
import SubjectSelectPage from '../views/SubjectSelectPage'
import SubjectSelectHeaderRight from '../views/SubjectSelectPage/SubjectSelectHeaderRight'
import { useDispatch, useStore } from 'react-redux'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import SearchPage from '../views/SearchPage'
import CommodityListPage from '../views/CommodityListPage'
import WebSchoolAuth from '../views/SchoolAuth/WebSchoolAuth'
import CommodityDetailPage from '../views/CommodityDetailPage'
import FullScreenImagePage from '../views/FullScreenImagePage'
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type'
import UserInfoPage from '../views/UserInfoPage'
import OrderConfirmPage from '../views/OrderConfirmPage'
import { ProcessedCommodity } from '../api/server/commodity'
import PendingReceivePage from '../views/PendingReceivePage'

const Stack = createNativeStackNavigator()

export const HOME_TABS = 'Home'
export const PERSONAL_CENTER_TABS = 'PersonalCenter'
export const CLASS_SCHEDULE_TABS = 'ClassSchedule'
export const SCHOOL_AUTH = 'SchoolAuth'
export const PERSONAL_INFO = 'PersonalInfo'
export const LESSONS_TABLE_CONFIG_PAGE = 'LessonsTableConfigPage'
export const LESSONS_DETAIL = 'LessonsDetail'
export const EMPTY_PAGE = 'EmptyPage'
export const SETTINGS_PAGE = 'SettingsPage'
export const ABOUT_PAGE = 'AboutPage'
export const WEB_PAGE = 'WebPage'
export const SCORE_QUERY = 'ScoreQuery'
export const SUBJECT_SELECT_PAGE = 'SubjectSelectPage'
export const FLEA_MARKET_TABS = 'FleaMarket'
export const SEARCH_PAGE = 'SearchPage'
export const COMMODITY_LIST_PAGE = 'CommodityListPage'
export const COMMODITY_DETAIL_PAGE = 'CommodityDetailPage'
export const FULL_SCREEN_IMAGE_PAGE = 'FullScreenImagePage'
export const USER_INFO_PAGE = 'UserInfoPage'
export const ORDER_CONFIRM_PAGE = 'OrderConfirmPage'
export const PENDING_RECEIVE_PAGE = 'PendingReceivePage'

export interface RouterTypes extends ParamListBase {
  [HOME_TABS]: undefined
  [PERSONAL_CENTER_TABS]: undefined
  [CLASS_SCHEDULE_TABS]: undefined
  [SCHOOL_AUTH]: undefined
  [PERSONAL_INFO]: undefined
  [LESSONS_TABLE_CONFIG_PAGE]: undefined
  [LESSONS_DETAIL]: {
    /**
     * 第几周的课
     */
    week: number
    /**
     * 上课时间
     */
    startTime: number
  }
  [EMPTY_PAGE]: undefined
  [SETTINGS_PAGE]: undefined
  [ABOUT_PAGE]: undefined
  [WEB_PAGE]: {
    url: string
  }
  [SCORE_QUERY]: undefined
  [SUBJECT_SELECT_PAGE]: undefined
  [FLEA_MARKET_TABS]: undefined
  [SEARCH_PAGE]: {
    placeholder?: string
  }
  [COMMODITY_LIST_PAGE]: {
    search: string
  }
  [COMMODITY_DETAIL_PAGE]: {
    /**
     * 商品id
     */
    id: number
  }
  [FULL_SCREEN_IMAGE_PAGE]: {
    images: IImageInfo[]
    index?: number
  }
  [USER_INFO_PAGE]: {
    id: number
  }
  [ORDER_CONFIRM_PAGE]: {
    commodity: ProcessedCommodity
    remark: string
  }
  [PENDING_RECEIVE_PAGE]: undefined
}
export type UseRouteGeneric<RouterName extends keyof RouterTypes> = RouteProp<
  Pick<RouterTypes, RouterName>
>
export type UseNavigationGeneric = NavigationProp<RouterTypes>

const headerCommonOptions: NativeStackNavigationOptions = {
  headerBackImageSource: require('../assets/img/back.png'),
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontSize: global.styles.$font_size_lg,
  },
  headerShadowVisible: false,
}
const hideHeaderOptions: NativeStackNavigationOptions = {
  header: () => null,
}

const headerCommonOptionsWithTitle = (
  title: string
): NativeStackNavigationOptions => {
  return {
    ...headerCommonOptions,
    title,
  }
}

const Router: React.FC = () => {
  const store = useStore<ReducerTypes>()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      checkLogin(status => {
        if (status.isSuccess) {
          // 更新当前周
          const state = store.getState()
          dispatch(
            updateCurWeek(
              state.lessonsTable.options.year,
              state.lessonsTable.options.term
            )
          )
        }
        store.dispatch(markCheckLoginDone())
      })
    )
  }, [])
  return (
    <NavigationContainer theme={defaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: { fontSize: global.styles.$font_size_lg },
        }}>
        <Stack.Screen
          name={HOME_TABS}
          component={TabBar}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={SCHOOL_AUTH}
          component={WebSchoolAuth}
          options={hideHeaderOptions}
        />
        <Stack.Screen
          name={PERSONAL_INFO}
          component={PersonalInfo}
          options={headerCommonOptionsWithTitle('个人资料')}
        />
        <Stack.Screen
          name={LESSONS_TABLE_CONFIG_PAGE}
          component={LessonsTableConfigPage}
          options={headerCommonOptionsWithTitle('课程表设置')}
        />
        <Stack.Screen
          name={LESSONS_DETAIL}
          component={LessonsDetail}
          options={headerCommonOptionsWithTitle('课程详细')}
        />
        <Stack.Screen
          name={EMPTY_PAGE}
          component={EmptyPage}
          options={headerCommonOptionsWithTitle('应用正在开发中')}
        />
        <Stack.Screen
          name={SETTINGS_PAGE}
          component={SettingsPage}
          options={headerCommonOptionsWithTitle('设置')}
        />
        <Stack.Screen
          name={ABOUT_PAGE}
          component={AboutPage}
          options={headerCommonOptionsWithTitle('关于')}
        />
        <Stack.Screen
          name={WEB_PAGE}
          component={Webpage}
          options={headerCommonOptionsWithTitle('加载中')}
        />
        <Stack.Screen
          name={SCORE_QUERY}
          component={ScoreQueryPage}
          options={headerCommonOptionsWithTitle('成绩查询')}
        />
        <Stack.Screen
          name={SUBJECT_SELECT_PAGE}
          component={SubjectSelectPage}
          options={{
            ...headerCommonOptionsWithTitle('选课工具'),
            headerRight: () => <SubjectSelectHeaderRight />,
          }}
        />
        <Stack.Screen
          name={SEARCH_PAGE}
          component={SearchPage}
          options={hideHeaderOptions}
        />
        <Stack.Screen
          name={COMMODITY_LIST_PAGE}
          component={CommodityListPage}
          options={{ header: () => null, animation: 'none' }}
        />
        <Stack.Screen
          name={COMMODITY_DETAIL_PAGE}
          component={CommodityDetailPage}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={FULL_SCREEN_IMAGE_PAGE}
          component={FullScreenImagePage}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name={USER_INFO_PAGE}
          component={UserInfoPage}
          options={headerCommonOptionsWithTitle('用户信息')}
        />
        <Stack.Screen
          name={ORDER_CONFIRM_PAGE}
          component={OrderConfirmPage}
          options={headerCommonOptionsWithTitle('确认订单')}
        />
        <Stack.Screen
          name={PENDING_RECEIVE_PAGE}
          component={PendingReceivePage}
          options={headerCommonOptionsWithTitle('待收货')}
        />
      </Stack.Navigator>
      <DiyToast />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </NavigationContainer>
  )
}

export default Router
