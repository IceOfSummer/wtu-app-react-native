import React, { useEffect, useRef, useState } from 'react'
import { Image, PixelRatio, ViewStyle } from 'react-native'
import WebView from 'react-native-webview'
import { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes'

interface RichTextPresentView {
  style?: ViewStyle
  containerStyle?: ViewStyle
  content: string
}

type WebViewMessage = {
  type: 'height'
  data: any
}

const RichTextPresentView: React.FC<RichTextPresentView> = props => {
  const [html, setHtml] = useState<string | undefined>()
  const [height, setHeight] = useState(0)
  const webView = useRef<WebView>(null)
  useEffect(() => {
    fetch(
      Image.resolveAssetSource(
        require('../../../assets/html/rich_text_view.html')
      ).uri
    )
      .then(resp => resp.text())
      .then(_html => setHtml(_html))
  })
  const onLoad = () => {
    webView.current?.injectJavaScript(`setContents(${props.content})`)
  }

  const onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    const message = JSON.parse(nativeEvent.data) as WebViewMessage
    if (message.type === 'height') {
      setHeight(PixelRatio.roundToNearestPixel(message.data))
    }
  }

  if (!html) {
    return null
  }
  return (
    <WebView
      onLoad={onLoad}
      ref={webView}
      onMessage={onMessage}
      style={[{ height, width: '100%' }, props.style]}
      containerStyle={props.containerStyle}
      source={{ html }}
      originWhitelist={['*']}
    />
  )
}

export default RichTextPresentView
