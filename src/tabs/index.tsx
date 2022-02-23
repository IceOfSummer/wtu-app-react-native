import { NavigationContainer } from '@react-navigation/native'
import Icons from '../utils/Icons'
import Home from './Home'
import ClassSchedule from './ClassSchedule'
import Applications from './Applications'
import PersonalCenter from './PersonalCenter'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useStore } from 'react-redux'

const Tab = createBottomTabNavigator()
const HOME = 'Home'
const CLASS_SCHEDULE = 'ClassSchedule'
const APPLICATION = 'Applications'
const PERSONAL_CENTER = 'PersonalCenter'

const TabBar = () => {
  const store = useStore()
  console.log(store.getState())
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: param => {
            switch (route.name) {
              case HOME:
                return <Icons iconText="&#xe613;" {...param} />
              case CLASS_SCHEDULE:
                return <Icons iconText="&#xe62c;" {...param} />
              case APPLICATION:
                return <Icons iconText="&#xe603;" {...param} />
              case PERSONAL_CENTER:
                return <Icons iconText="&#xe608;" {...param} />
              default:
                throw new Error('unknown route name')
            }
          },
          header: () => {
            return null
          },
        })}>
        <Tab.Screen name={HOME} component={Home} />
        <Tab.Screen name={CLASS_SCHEDULE} component={ClassSchedule} />
        <Tab.Screen name={APPLICATION} component={Applications} />
        <Tab.Screen name={PERSONAL_CENTER} component={PersonalCenter} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default TabBar
