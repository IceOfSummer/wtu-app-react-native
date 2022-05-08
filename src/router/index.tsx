import React, { useEffect } from 'react'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import TabBar from '../tabs'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import SchoolAuth from '../views/SchoolAuth'
import PersonalInfo from '../views/PersonalInfo'
import DiyToast from '../component/DiyToast/NavToast'
import { StatusBar } from 'react-native'
import LessonsTableConfigPage from '../views/LessonsTableConfigPage'
import LessonsDetail from '../views/LessonsDetail'
import EmptyPage from '../views/EmptyPage'
import SettingsPage from '../views/SettingsPage'
import AboutPage from '../views/AboutPage'
import defaultTheme from './Theme/defaultTheme'
import { useStore } from 'react-redux'
import { updateCurWeek } from '../redux/actions/lessonsTable'
import Webpage from '../views/Webpage'
import ScoreQueryPage from '../views/ScoreQueryPage'
import { checkLogin } from '../redux/actions/user'
import { markCheckLoginDone } from '../redux/actions/temporaryData'
import { ReducerTypes } from '../redux/reducers'
import SubjectSelectPage from '../views/SubjectSelectPage'

const Stack = createNativeStackNavigator()

export const HOME_TABS = 'Home'
export const PERSONAL_CENTER_TABS = 'PersonalCenter'
export const CLASS_SCHEDULE_TABS = 'ClassSchedule'
export const APPLICATIONS_TABS = 'Applications'
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

export interface RouterTypes extends ParamListBase {
  [HOME_TABS]: undefined
  [PERSONAL_CENTER_TABS]: undefined
  [CLASS_SCHEDULE_TABS]: undefined
  [APPLICATIONS_TABS]: undefined
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
}

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
  useEffect(() => {
    store.dispatch(
      checkLogin(status => {
        if (status.isSuccess) {
          // 更新当前周
          const state = store.getState()
          store.dispatch(
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
          component={SchoolAuth}
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
          options={headerCommonOptionsWithTitle('选课工具')}
        />
      </Stack.Navigator>
      <DiyToast />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </NavigationContainer>
  )
}

export default Router
