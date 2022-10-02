import React from 'react'
import { TabBar } from 'react-native-tab-view'
import Chat from './tabs/Chat'
import Square from './tabs/Square'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { Pressable } from 'react-native'
import {
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/types'
import { StyleSheet, Text, View } from 'react-native'
import Icons from '../../component/Icons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types'
import Care from './tabs/Care'

const Tab = createMaterialTopTabNavigator()

const MessageScreen: React.FC = () => {
  return (
    <Tab.Navigator tabBar={MyTabBar} screenOptions={{ lazy: true }}>
      <Tab.Screen name="聊天" component={Chat} navigationKey="chat" />
      <Tab.Screen name="广场" component={Square} navigationKey="square" />
      <Tab.Screen name="关注" component={Care} navigationKey="care" />
    </Tab.Navigator>
  )
}

function MyTabBar(props: MaterialTopTabBarProps) {
  return (
    <View style={styles.topTabBarContainer}>
      <Pressable>
        <Icons iconText="&#xe79b;" size={25} color={global.colors.textColor} />
      </Pressable>
      <RenderTabBar {...props} navigationState={props.state} />
      <Pressable>
        <Icons iconText="&#xe632;" size={25} color={global.colors.textColor} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  topTabBarContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: global.colors.boxBackgroundColor,
  },
})

const RenderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<any>
  }
) => {
  const colors = useSelector<ReducerTypes, ThemeColors>(
    state => state.theme.colors
  )
  return (
    <TabBar
      {...props}
      pressColor={'transparent'}
      indicatorStyle={{ backgroundColor: colors.primaryColor }}
      style={{
        width: '50%',
        backgroundColor: colors.boxBackgroundColor,
        borderColor: colors.borderColor,
        elevation: 0,
        alignSelf: 'center',
      }}
      indicatorContainerStyle={{ shadowColor: 'red' }}
      bounces={false}
      activeColor={colors.primaryColor}
      inactiveColor={colors.infoTextColor}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            fontSize: global.styles.$font_size_lg,
            fontWeight: focused ? 'bold' : 'normal',
            color: color,
          }}>
          {route.name}
        </Text>
      )}
    />
  )
}

export default MessageScreen
