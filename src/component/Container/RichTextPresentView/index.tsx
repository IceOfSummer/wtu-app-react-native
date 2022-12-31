import React from 'react'
import { Image, PixelRatio, ViewStyle } from 'react-native'
import WebView from 'react-native-webview'
import {
  WebViewMessageEvent,
  WebViewSource,
} from 'react-native-webview/lib/WebViewTypes'
import Environment from '../../../utils/Environment'
import { getLogger } from '../../../utils/LoggerUtils'

const logger = getLogger('/component/Container/RichTextPresentView')

interface RichTextPresentViewProps {
  style?: ViewStyle
  containerStyle?: ViewStyle
  content: string
}

type WebViewMessage = {
  type: 'height'
  data: any
}
async function getSource(): Promise<WebViewSource> {
  if (__DEV__) {
    const source = await fetch(
      Image.resolveAssetSource(
        require('../../../assets/html/rich_text_view.html')
      ).uri
    )
    return {
      html: await source.text(),
    }
  } else {
    return {
      uri: Environment.cdnUrl + '/static/html/rich_text_view.html',
    }
  }
}

interface RichTextPresentViewState {
  height: number
  source?: WebViewSource
}

export default class RichTextPresentView extends React.Component<
  RichTextPresentViewProps,
  RichTextPresentViewState
> {
  webView = React.createRef<WebView>()

  onLoad = () => {
    if (this.props.content[0] === '{') {
      this.webView.current?.injectJavaScript(
        `setContents(${this.props.content})`
      )
    } else {
      this.webView.current?.injectJavaScript(
        `setContents('${this.props.content}')`
      )
    }
  }

  onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    const message = JSON.parse(nativeEvent.data) as WebViewMessage
    if (message.type === 'height') {
      const hei = PixelRatio.roundToNearestPixel(message.data)
      this.setState({ height: hei })
      logger.info('webView height: ' + hei)
    }
  }

  constructor(
    props: Readonly<RichTextPresentViewProps> | RichTextPresentViewProps
  ) {
    super(props)
    this.state = { height: 0 }
    getSource()
      .then(s => {
        this.setState({
          source: s,
        })
      })
      .catch(e => {
        logger.error('load source failed: ' + e.message)
      })
  }

  render() {
    return (
      <WebView
        onLoad={this.onLoad}
        ref={this.webView}
        onMessage={this.onMessage}
        style={[{ height: this.state.height, width: '100%' }, this.props.style]}
        containerStyle={this.props.containerStyle}
        source={this.state.source}
        showsVerticalScrollIndicator={false}
      />
    )
  }
}
