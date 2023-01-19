import React from 'react'
import WebView from 'react-native-webview'
import {
  Image,
  LayoutChangeEvent,
  PixelRatio,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  WebViewErrorEvent,
  WebViewMessageEvent,
} from 'react-native-webview/lib/WebViewTypes'
import { getLogger } from '../../../utils/LoggerUtils'
import ImagePickMenu, {
  ImageProperty,
} from '../../Drawer/BottomMenu/ImagePickMenu'
import Loading from '../../Loading'
import {
  requirePublicSpaceUploadSecret,
  SignInfo,
  uploadFileToPublicSpace,
} from '../../../api/server/cos'
import Toast from 'react-native-root-toast'
import Environment from '../../../utils/Environment'
import Drawer from '../../Drawer'
import DrawerCommonContainer from '../../Drawer/DrawerCommonContainer'
import Clipboard from '@react-native-clipboard/clipboard'

const logger = getLogger('/component/Container/RichTextEditor')

interface RichTextEditorProps {
  type?: 'all_functions' | 'image_only'
  onHeightChange?: (height: number) => void
  /**
   * 最大高度。若不提供则会无效扩容
   */
  maxHeight?: number
}

interface RichTextEditorState {
  html: string
  height: number
  clipboardText: string
}
interface WebViewMessageType {
  image: void
  content: EditorData
  height: number
}
export type EditorData = {
  /**
   * 纯文本
   */
  text: string
  /**
   * 包含html的内容
   */
  content: string
}

type WebViewMessage<T extends keyof WebViewMessageType> = {
  type: T
  data: WebViewMessageType[T]
}

export default class RichTextEditor extends React.Component<
  RichTextEditorProps,
  RichTextEditorState
> {
  webView = React.createRef<WebView>()

  imagePick = React.createRef<ImagePickMenu>()

  /**
   * 额外内容的高度
   */
  extraContentHeight: number = 0

  htmlInputRef = React.createRef<Drawer>()

  /**
   * 图片本地url -> 远程url
   *
   * 避免相同重复上传
   */
  imageCache = new Map<string, string>()

  onMessage(message: WebViewMessageEvent) {
    let msg: WebViewMessage<any>
    logger.debug('receive webview message: ' + message.nativeEvent.data)
    try {
      msg = JSON.parse(message.nativeEvent.data)
    } catch (e) {
      logger.error('parse message failed, content: ' + message.nativeEvent.data)
      return
    }
    if (msg.type === 'image') {
      this.imagePick.current?.showDrawer()
    } else if (msg.type === 'content') {
      const contentMessage = msg as WebViewMessage<'content'>
      this.contentResolveCallback?.(contentMessage.data)
    } else if (msg.type === 'height') {
      const contentMessage = msg as WebViewMessage<'height'>
      let height = this.extraContentHeight
      if (this.props.maxHeight) {
        height += Math.min(
          this.props.maxHeight,
          PixelRatio.roundToNearestPixel(contentMessage.data)
        )
      } else {
        height += PixelRatio.roundToNearestPixel(contentMessage.data)
      }
      this.setState({
        height,
      })
    } else {
      logger.warn('unknown message type, data: ' + message.nativeEvent.data)
    }
  }

  private insertImage(url: string) {
    logger.info('insert image: ' + url)
    this.webView.current?.injectJavaScript(
      `insertImage('${Environment.cdnUrl + url}')`
    )
  }

  contentResolveCallback: ((content: EditorData) => void) | undefined

  public getContent() {
    return new Promise<EditorData>(resolve => {
      this.contentResolveCallback = resolve
      this.webView.current?.injectJavaScript('rnGetContent()')
    })
  }

  imageUploadSignCache: SignInfo | undefined

  async onImagePick(image: ImageProperty[]) {
    const img = image[0]
    if (!img) {
      return
    }
    const remoteUrl = this.imageCache.get(img.path)
    logger.info('uploading image...')
    if (remoteUrl) {
      logger.info('image has already uploaded!')
      this.insertImage(remoteUrl)
      return
    }
    Loading.showLoading('上传图片中')
    if (!this.imageUploadSignCache) {
      logger.info('requesting upload sign')
      try {
        this.imageUploadSignCache = (
          await requirePublicSpaceUploadSecret(img.contentType)
        ).data
      } catch (e: any) {
        logger.info('request upload sign failed: ' + e.message)
        Toast.show('上传文件失败: ' + e.message)
        Loading.hideLoading()
        return
      }
    }
    try {
      await uploadFileToPublicSpace(
        this.imageUploadSignCache,
        img.path,
        img.contentType
      )
      this.insertImage(this.imageUploadSignCache.path)
      // save to cache
      this.imageCache.set(img.path, this.imageUploadSignCache.path)
      this.imageUploadSignCache = undefined
    } catch (e: any) {
      logger.error('image upload failed: ' + e.message)
      Toast.show('图片上传失败: ' + e.message)
    } finally {
      Loading.hideLoading()
    }
  }

  onWebViewError({ nativeEvent }: WebViewErrorEvent) {
    Toast.show(nativeEvent.description)
    logger.error(
      'webview error: ' + nativeEvent.title + '; ' + nativeEvent.description
    )
  }

  openHtmlImportDrawer = () => {
    Clipboard.getString()
      .then(str => {
        this.htmlInputRef.current?.showDrawer()
        this.setState({
          clipboardText: str,
        })
      })
      .catch(e => {
        logger.error('get clipboard content failed: ' + e.message)
        Toast.show('获取剪切板失败: ' + e.message)
      })
  }

  /**
   * 将剪切板内容导入的富文本编辑器中
   */
  inputHtml = () => {
    this.webView.current?.injectJavaScript(
      `setContents('${this.state.clipboardText}')`
    )
    this.htmlInputRef.current?.closeDrawer()
    Toast.show('导入成功!')
  }

  toPcEditor = () => {
    Clipboard.setString(Environment.cdnUrl + '/static/html/pc_rich_editor.html')
    this.htmlInputRef.current?.showToast('已复制链接，请在浏览器打开')
  }

  constructor(props: any) {
    super(props)
    this.state = {
      html: '',
      height: 0,
      clipboardText: '',
    }
    this.onMessage = this.onMessage.bind(this)
    this.onImagePick = this.onImagePick.bind(this)
    this.onWebViewError = this.onWebViewError.bind(this)

    if (__DEV__) {
      fetch(
        Image.resolveAssetSource(
          require('../../../assets/html/rich_editor.html')
        ).uri
      )
        .then(resp => resp.text())
        .then(html => {
          this.setState({ html })
        })
    }
  }

  /**
   * 直接把高度设置在webView上还有bug，有时候有效，有时候无效
   */
  onExtraContentLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    if (this.extraContentHeight === 0) {
      this.extraContentHeight = nativeEvent.layout.height
      this.setState({
        height: this.extraContentHeight + this.state.height,
      })
    }
  }

  render() {
    return (
      <View style={{ height: this.state.height }}>
        <WebView
          ref={this.webView}
          containerStyle={{
            height: this.state.height,
          }}
          source={
            __DEV__
              ? { html: this.state.html }
              : { uri: Environment.cdnUrl + '/static/html/rich_editor.html' }
          }
          originWhitelist={['*']}
          onMessage={this.onMessage}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          onError={this.onWebViewError}
        />
        <View onLayout={this.onExtraContentLayout}>
          <Text
            style={[global.styles.infoTipText, styles.infoText]}
            onPress={this.openHtmlImportDrawer}>
            导入html文本
          </Text>
        </View>
        <ImagePickMenu onSelect={this.onImagePick} ref={this.imagePick} />
        <Drawer ref={this.htmlInputRef}>
          <DrawerCommonContainer
            title="导入html文本"
            buttonText="导入"
            onSubmit={this.inputHtml}>
            <Text style={styles.text}>
              由于在移动端编辑富文本很麻烦，因此您可以选择
              <Text style={styles.linkText} onPress={this.toPcEditor}>
                在电脑端编写富文本
              </Text>
              . 我们将会读取你的剪切板，你只需要将电脑端生成的内容复制下来即可.
              <Text style={styles.warningText}>
                警告: 这将覆盖当前已经编写的内容
              </Text>
            </Text>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.text}>当前剪切板内容:</Text>
              <Text numberOfLines={10}>{this.state.clipboardText}</Text>
            </View>
          </DrawerCommonContainer>
        </Drawer>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  infoText: {
    textDecorationLine: 'underline',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: global.colors.primaryColor,
  },
  text: {
    color: global.colors.textColor,
  },
  warningText: {
    color: global.colors.warning_color,
  },
})
