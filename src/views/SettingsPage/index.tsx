import React from 'react'
import SettingsHome from './route/SettingsHome'
import LessonsTableSettings from './route/LessonsTableSettings'
import About from './route/About'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { headerCommonOptionsWithTitle } from '../../router'
import LogsPage from './route/LogsPage'
import UserSettingPage from './route/UserSettingPage'

const Stack = createNativeStackNavigator()
export const LESSONS_TABLE_SETTINGS_PAGE = '/Settings/LessonsTable'
export const ABOUT_PAGE = '/Settings/About'
export const LOGS_PAGE = '/Settings/Logs'
const SETTINGS_HOME = '/Settings/Home'
export const USER_SETTINGS_PAGE = '/Settings/UserSettings'

const SettingsPage: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={SETTINGS_HOME}>
      <Stack.Group>
        <Stack.Screen
          name={SETTINGS_HOME}
          component={SettingsHome}
          options={headerCommonOptionsWithTitle('设置')}
        />
        <Stack.Screen
          name={LESSONS_TABLE_SETTINGS_PAGE}
          component={LessonsTableSettings}
          options={headerCommonOptionsWithTitle('课程表设置')}
        />
        <Stack.Screen
          name={ABOUT_PAGE}
          component={About}
          options={headerCommonOptionsWithTitle('关于')}
        />
        <Stack.Screen
          name={LOGS_PAGE}
          component={LogsPage}
          options={headerCommonOptionsWithTitle('日志')}
        />
        <Stack.Screen
          name={USER_SETTINGS_PAGE}
          component={UserSettingPage}
          options={headerCommonOptionsWithTitle('用户信息')}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default SettingsPage
