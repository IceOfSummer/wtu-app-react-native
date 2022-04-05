import React, { useRef } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { WEB_PAGE, RouterTypes } from '../../router'
import {
  WebViewMessageEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes'
import WebView from 'react-native-webview'
import { Animated, Dimensions, View } from 'react-native'

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

const Webpage: React.FC = () => {
  const route = useRoute<RouteType>()
  const nav = useNavigation()
  const webView = useRef<WebView>(null)

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
      console.warn(`invalid message type, receive: ${nativeEvent.data}`)
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

  const onLoadEnd = () => {
    Animated.timing(loadingBarOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 600,
    }).start(() => {
      loadingBarTranX.setValue(0)
      loadingBarOpacity.setValue(1)
    })
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
    </View>
  )
}

export default Webpage
