import React from 'react'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { Image, Pressable, useWindowDimensions } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import Icons from '../../component/Icons'
import useNav from '../../hook/useNav'
import { SERVER_AUTH_PAGE } from '../../router'
import getDefaultHeaderHeight from 'react-native-screens/src/native-stack/utils/getDefaultHeaderHeight'
import Chat from './tabs/Chat'
import CustomStatusBar from '../../component/Container/CustomStatusBar'

const MessageScreen: React.FC = () => {
  const authenticated = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
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

/**
 * 用户登录后显示消息界面
 */
const AuthenticatedView = () => {
  const { width, height } = useWindowDimensions()
  const headerHeight = getDefaultHeaderHeight({ width, height }, 0, 'formSheet')
  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar backgroundColor={global.colors.boxBackgroundColor} />
      <View style={[styles.topTabBarContainer, { height: headerHeight }]}>
        <Pressable>
          <Icons
            iconText="&#xe79b;"
            size={25}
            color={global.colors.textColor}
          />
        </Pressable>
        <Text
          style={{
            color: global.colors.primaryColor,
            fontSize: global.styles.$font_size_lg,
          }}>
          消息
        </Text>
        <Pressable>
          <Icons
            iconText="&#xe632;"
            size={25}
            color={global.colors.textColor}
          />
        </Pressable>
      </View>
      <Chat />
    </View>
  )
}

const styles = StyleSheet.create({
  topTabBarContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
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

export default MessageScreen
