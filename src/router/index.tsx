import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabBar from '../tabs'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import SchoolAuth from '../views/SchoolAuth'

const Stack = createNativeStackNavigator()

export const HOME_TABS = 'Home'
export const PERSONAL_CENTER_TABS = 'PersonalCenter'
export const CLASS_SCHEDULE_TABS = 'ClassSchedule'
export const APPLICATIONS_TABS = 'Applications'
export const SCHOOL_AUTH = 'SchoolAuth'

export interface RouterTypes extends ParamListBase {
  [HOME_TABS]: undefined
  [PERSONAL_CENTER_TABS]: undefined
  [CLASS_SCHEDULE_TABS]: undefined
  [APPLICATIONS_TABS]: undefined
  [SCHOOL_AUTH]: undefined
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
        <Stack.Screen name={SCHOOL_AUTH} component={SchoolAuth} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router
