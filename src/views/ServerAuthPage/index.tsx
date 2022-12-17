import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import LoginPage from './tabs/LoginPage'
import RegisterPage from './tabs/RegisterPage'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { UseNavigationGeneric } from '../../router'

const Tab = createMaterialTopTabNavigator()

export const LOGIN_PAGE = 'ServerAuthLogin'
export const REGISTER_PAGE = 'ServerAuthRegister'
export type NavigationType = NavigationProp<{
  [LOGIN_PAGE]: undefined
  [REGISTER_PAGE]: undefined
}> &
  UseNavigationGeneric
/**
 * APP认证页面
 */
const ServerAuthPage: React.FC = () => {
  return (
    <LinearGradient
      colors={['#3494E6', '#EC6EAD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ width: '100%', height: '100%', paddingTop: 12 }}>
      <Tab.Navigator
        sceneContainerStyle={{ backgroundColor: 'transparent' }}
        tabBar={() => null}
        screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen
          name={LOGIN_PAGE}
          component={LoginPage}
          navigationKey={LOGIN_PAGE}
        />
        <Tab.Screen
          name={REGISTER_PAGE}
          component={RegisterPage}
          navigationKey={REGISTER_PAGE}
        />
      </Tab.Navigator>
    </LinearGradient>
  )
}

export default ServerAuthPage
