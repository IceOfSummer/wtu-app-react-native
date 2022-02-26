import React from 'react'
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import TabBar from '../tabs'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import SchoolAuth from '../views/SchoolAuth'
import PersonalInfo from '../tabs/PersonalCenterScreen/PersonalInfo'

const Stack = createNativeStackNavigator()

export const HOME_TABS = 'Home'
export const PERSONAL_CENTER_TABS = 'PersonalCenter'
export const CLASS_SCHEDULE_TABS = 'ClassSchedule'
export const APPLICATIONS_TABS = 'Applications'
export const SCHOOL_AUTH = 'SchoolAuth'
export const PERSONAL_INFO = 'PersonalInfo'

export interface RouterTypes extends ParamListBase {
  [HOME_TABS]: undefined
  [PERSONAL_CENTER_TABS]: undefined
  [CLASS_SCHEDULE_TABS]: undefined
  [APPLICATIONS_TABS]: undefined
  [SCHOOL_AUTH]: undefined
  [PERSONAL_INFO]: undefined
}

const headerCommonOptions: NativeStackNavigationOptions = {
  headerBackImageSource: require('../assets/img/back.png'),
  headerTitleAlign: 'center',
}
const hideHeaderOptions: NativeStackNavigationOptions = {
  header: () => null,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const headerCommonOptionsWithTile = (
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
      <Stack.Navigator>
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
        <Stack.Screen name={PERSONAL_INFO} component={PersonalInfo} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router
