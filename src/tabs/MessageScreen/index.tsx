import React from 'react'
import { TabBar } from 'react-native-tab-view'
import Chat from './tabs/Chat'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { Image, Pressable, useWindowDimensions } from 'react-native'
import {
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/types'
import { StyleSheet, Text, View } from 'react-native'
import Icons from '../../component/Icons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types'
import useNav from '../../hook/useNav'
import { SERVER_AUTH_PAGE } from '../../router'
import getDefaultHeaderHeight from 'react-native-screens/src/native-stack/utils/getDefaultHeaderHeight'
import useAutoColorStatusBar from '../../hook/useAutoColorStatusBar'
import Square from './tabs/Square'

const MessageScreen: React.FC = () => {
  const authenticated = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
  useAutoColorStatusBar(false, global.colors.boxBackgroundColor)
  const { width } = useWindowDimensions()
  const nav = useNav()
  if (authenticated) {
    return <AuthenticatedView />
  } else {
    return (
      <View style={styles.unLoginBox}>
        <Image
          source={require('../../assets/img/authwanted.png')}
          style={{ width: width / 2, height: width / 2, marginTop: '-30%' }}
        />
        <Text
          style={styles.loginTipText}
          onPress={() => nav.push(SERVER_AUTH_PAGE)}>
          请先登录
        </Text>
      </View>
    )
  }
}

const Tab = createMaterialTopTabNavigator()

/**
 * 用户登录后显示消息界面
 */
const AuthenticatedView = () => {
  useAutoColorStatusBar(false, '#fff')
  return (
    <Tab.Navigator tabBar={MyTabBar} screenOptions={{ lazy: true }}>
      <Tab.Screen name="消息" component={Chat} navigationKey="chat" />
      <Tab.Screen name="广场" component={Square} navigationKey="square" />
    </Tab.Navigator>
  )
}

/**
 * 渲染TabBar，主要是给左右加图标
 */
function MyTabBar(props: MaterialTopTabBarProps) {
  const { width, height } = useWindowDimensions()
  const headerHeight = getDefaultHeaderHeight({ width, height }, 0, 'formSheet')
  return (
    <View style={[styles.topTabBarContainer, { height: headerHeight }]}>
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
  loginTipText: {
    color: global.colors.primaryColor,
    textDecorationLine: 'underline',
  },
  unLoginBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

/**
 * 渲染每个Tabs和指示器
 *
 * 详细可以参考 `react-native-tab-view` 依赖中的用法
 */
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
        height: '100%',
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
