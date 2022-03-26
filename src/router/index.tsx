import React from 'react'
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

const Stack = createNativeStackNavigator()

export const HOME_TABS = 'Home'
export const PERSONAL_CENTER_TABS = 'PersonalCenter'
export const CLASS_SCHEDULE_TABS = 'ClassSchedule'
export const APPLICATIONS_TABS = 'Applications'
export const SCHOOL_AUTH = 'SchoolAuth'
export const PERSONAL_INFO = 'PersonalInfo'
export const LESSONS_TABLE_CONFIG_PAGE = 'LessonsTableConfigPage'
export const LESSONS_DETAIL = 'lessonsDetail'
export const EMPTY_PAGE = 'emptyPage'

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
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
      <DiyToast />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </NavigationContainer>
  )
}

export default Router
