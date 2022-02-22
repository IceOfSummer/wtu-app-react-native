import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/tabs/Home'
import Applications from './src/tabs/Applications'
import ClassSchedule from './src/tabs/ClassSchedule'
import PersonalCenter from './src/tabs/PersonalCenter'
import Icons from './src/utils/Icons'

const Tab = createBottomTabNavigator()
const HOME = 'Home'
const CLASS_SCHEDULE = 'ClassSchedule'
const APPLICATION = 'Applications'
const PERSONAL_CENTER = 'PersonalCenter'

const App = () => {
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
        })}>
        <Tab.Screen name={HOME} component={Home} />
        <Tab.Screen name={CLASS_SCHEDULE} component={ClassSchedule} />
        <Tab.Screen name={APPLICATION} component={Applications} />
        <Tab.Screen name={PERSONAL_CENTER} component={PersonalCenter} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App
