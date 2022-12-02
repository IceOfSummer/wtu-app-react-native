import React from 'react'
import SettingsHome from './route/SettingsHome'
import LessonsTableSettings from './route/LessonsTableSettings'
import About from './route/About'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { headerCommonOptionsWithTitle } from '../../router'

const Stack = createNativeStackNavigator()
export const LESSONS_TABLE_SETTINGS_PAGE = '/Settings/LessonsTable'
export const ABOUT_PAGE = '/Settings/About'
const SETTINGS_HOME = '/Settings/Home'

const SettingsPage: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={SETTINGS_HOME}>
      <Stack.Group screenOptions={{ animation: 'slide_from_right' }}>
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
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default SettingsPage
