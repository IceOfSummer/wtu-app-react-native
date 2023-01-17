import React from 'react'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { Image, useWindowDimensions } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import useNav from '../../hook/useNav'
import { SERVER_AUTH_PAGE } from '../../router'
import MessageTipHome from './components/MessageTipHome'

const MessageScreen: React.FC = () => {
  const authenticated = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
  const { width } = useWindowDimensions()
  const nav = useNav()
  if (authenticated) {
    return <MessageTipHome />
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

const styles = StyleSheet.create({
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
