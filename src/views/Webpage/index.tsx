import React, { useRef, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { WEB_PAGE, RouterTypes } from '../../router'
import {
  WebViewErrorEvent,
  WebViewMessageEvent,
  WebViewNavigationEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes'
import WebView from 'react-native-webview'
import { Animated, Dimensions, Pressable, View } from 'react-native'
import styles from './styles'
import Icons from '../../component/Icons'

type RouteType = RouteProp<Pick<RouterTypes, typeof WEB_PAGE>>

interface Message<T> {
  name: string
  data: T
}

interface TitleChangeMessage extends Message<string> {
  name: 'onTitleChange'
}

interface OpenNewWindowMessage extends Message<string> {
  name: 'onOpenNewWindow'
}

type Messages = TitleChangeMessage | OpenNewWindowMessage

export const FeedbackPage = 'https://xds.fit/webpage/#/feedback'
export const EduSystem =
  'http://jwglxt.wtu.edu.cn/xtgl/index_initMenu.html?jsdm=&_t=1649084664790'
export const HealthReport =
  'http://ehall.wtu.edu.cn/qljfwapp/sys/lwWtuPassCodeSchool/*default/index.do?null#/studentDetail'
export const EduAuthPage =
  'https://auth.wtu.edu.cn/authserver/login?service=http%3A%2F%2Fjwglxt.wtu.edu.cn%2Fsso%2Fjziotlogin'

const Webpage: React.FC = () => {
  const route = useRoute<RouteType>()
  const nav = useNavigation()
  const webView = useRef<WebView>(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  const script = `
    const titleDom = document.getElementsByTagName('title')[0]
    function _postMessage(name, data) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({name, data})
      )
    }
 
    // 监听标题变化
    const observer = new MutationObserver(() => {
      window.ReactNativeWebView.postMessage(
        _postMessage('onTitleChange', document.title)
      )
    })
    observer.observe(titleDom, {
      childList: true
    })
    // 初始化标题
    _postMessage('onTitleChange', document.title)
    
    // 拦截open()
    window.open = (url) => {
      document.location.assign(url)
    }
    
  `

  const onPostMsg = ({ nativeEvent }: WebViewMessageEvent) => {
    let msg: Messages
    try {
      msg = JSON.parse(nativeEvent.data) as Messages
    } catch (e) {
      // invalid message type
      console.log(`invalid message type, receive: ${nativeEvent.data}`)
      return
    }
    if (msg.name === 'onTitleChange') {
      nav.setOptions({ title: nativeEvent.title })
    }
  }

  // 处理加载条
  const loadingBarTranX = useRef(new Animated.Value(0)).current
  const loadingBarOpacity = useRef(new Animated.Value(1)).current
  const deviceWidth = Dimensions.get('window').width

  const onLoadProgress = ({ nativeEvent }: WebViewProgressEvent) => {
    Animated.timing(loadingBarTranX, {
      toValue: deviceWidth * nativeEvent.progress,
      useNativeDriver: true,
    }).start()
  }

  const onLoadEnd = ({
    nativeEvent,
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    // 用于教务系统登录
    Animated.timing(loadingBarOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 600,
    }).start(() => {
      loadingBarTranX.setValue(0)
      loadingBarOpacity.setValue(1)
    })
    setCanGoBack(nativeEvent.canGoBack)
    setCanGoForward(nativeEvent.canGoForward)
  }

  const go = () => {
    console.log('go')
    if (canGoForward) {
      webView.current?.goForward()
    }
  }

  const back = () => {
    console.log('back')
    if (canGoBack) {
      webView.current?.goBack()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        injectedJavaScript={script}
        ref={webView}
        onLoadEnd={onLoadEnd}
        onLoadProgress={onLoadProgress}
        source={{ uri: route.params.url }}
        onMessage={onPostMsg}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: 1,
          opacity: loadingBarOpacity,
          backgroundColor: global.styles.$primary_color,
          transform: [{ translateX: loadingBarTranX }],
        }}
      />
      <View style={styles.navigationBar}>
        <Pressable onPress={back}>
          <Icons
            iconText="&#xe61d;"
            size={20}
            color={
              canGoBack
                ? global.styles.$text_color
                : global.styles.$text_disable
            }
          />
        </Pressable>
        <Pressable onPress={() => webView.current?.reload()}>
          <Icons
            iconText="&#xec08;"
            size={16}
            color={global.styles.$text_color}
          />
        </Pressable>
        <Pressable onPress={go}>
          <Icons
            iconText="&#xe61c;"
            size={20}
            color={
              canGoForward
                ? global.styles.$text_color
                : global.styles.$text_disable
            }
          />
        </Pressable>
      </View>
    </View>
  )
}

export default Webpage
