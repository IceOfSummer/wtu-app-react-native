import React from 'react'
import {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import WebView from 'react-native-webview'
import {
  WebViewMessageEvent,
  WebViewSource,
} from 'react-native-webview/lib/WebViewTypes'
import Environment from '../../../utils/Environment'
import { getLogger } from '../../../utils/LoggerUtils'
import { processHtml } from '../../../utils/XssUtil'
import Toast from 'react-native-root-toast'
import ConditionHideContainer from '../ConditionHideContainer'

const logger = getLogger('/component/Container/RichTextPresentView')

interface RichTextPresentViewProps {
  style?: ViewStyle
  containerStyle?: ViewStyle
  content: string
}

type WebViewMessage = {
  type: 'height' | 'error'
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
    this.webView.current?.injectJavaScript(
      `setContents('${processHtml(this.props.content)}')`
    )
  }

  onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    const message = JSON.parse(nativeEvent.data) as WebViewMessage
    if (message.type === 'height') {
      const hei = PixelRatio.roundToNearestPixel(message.data)
      this.setState({ height: hei })
      logger.info('webView height: ' + hei)
    } else if (message.type === 'error') {
      logger.error(
        'show rich text failed: ' +
          message.data +
          '; rich text content: ' +
          this.props.content
      )
      Toast.show('富文本展示出错: ' + message.data)
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
      <React.Fragment>
        <WebView
          onLoad={this.onLoad}
          ref={this.webView}
          onMessage={this.onMessage}
          style={[
            { height: this.state.height, width: '100%' },
            this.props.style,
          ]}
          containerStyle={this.props.containerStyle}
          source={this.state.source}
          showsVerticalScrollIndicator={false}
        />
        <ConditionHideContainer hide={this.state.height > 0}>
          <View style={styles.loadingContainer}>
            <Text style={global.styles.infoTipText}>加载内容中...</Text>
          </View>
        </ConditionHideContainer>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 15,
  },
})
