import WebView from 'react-native-webview'
import { View } from 'react-native'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../redux/counter'
import {
  WebViewErrorEvent,
  WebViewMessageEvent,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes'
import {
  markLogin,
  saveUserCredentials,
} from '../../../redux/counter/wtuUserSlice'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
const injectScript = `
$(() => {
    const $loginBtn = $('#load')
    const $username = $('#mobileUsername')
    const $password = $('#mobilePassword')
    $loginBtn.click(() => {
        window.ReactNativeWebView.postMessage(
            JSON.stringify({username: $username.val(), password: $password.val()})
        )
    })
  })
`

type UserSecret = {
  username: string
  password: string
}

const AUTH_PAGE =
  'https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin'
/**
 * 使用webView进行身份验证
 * 网站进行了增强，会自动填充用户名和密码
 */
const WebSchoolAuth: React.FC = () => {
  const webView = useRef<WebView>(null)
  const dispatch = useDispatch()
  const nav = useNavigation()
  const { username, password } = useSelector<ReducerTypes, Partial<UserSecret>>(
    state => ({
      username: state.user.username,
      password: state.user.password,
    })
  )
  const injectForm = () => {
    if (!username || !password) {
      return
    }
    webView.current?.injectJavaScript(`
      const $username = $('#mobileUsername')
      const $password = $('#mobilePassword')
      const $rememberMe = $('#rememberMe')
      $rememberMe.prop("checked", true)
      $username.val('${username}')
      $password.val('${password}')
    `)
  }

  const onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    if (nativeEvent.data) {
      try {
        console.log(nativeEvent.data)
        const secret = JSON.parse(nativeEvent.data) as UserSecret
        if (secret.username && secret.password) {
          dispatch(saveUserCredentials(secret))
        }
      } catch (ignore) {}
    }
  }

  const onLoadEnd = ({
    nativeEvent,
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    if (nativeEvent.url === AUTH_PAGE) {
      injectForm()
    } else {
      // 登录成功
      dispatch(markLogin())
      Toast.show({ text1: '登录成功' })
      if (nav.canGoBack()) {
        nav.goBack()
      }
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView
        onLoadEnd={onLoadEnd}
        ref={webView}
        onMessage={onMessage}
        injectedJavaScript={injectScript}
        source={{
          uri: 'https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin',
        }}
      />
    </View>
  )
}

export default WebSchoolAuth
