import React from 'react'
import WebView from 'react-native-webview'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
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

const logger = getLogger('/component/Container/RichTextEditor')

interface RichTextEditorProps {
  type?: 'all_functions' | 'image_only'
}

interface RichTextEditorState {
  html: string
}
interface WebViewMessageType {
  image: void
  content: EditorData
}
export type EditorData = {
  text: string
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
    logger.info('uploading image...')
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

  constructor(props: any) {
    super(props)
    this.state = {
      html: '',
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={this.webView}
          containerStyle={styles.webView}
          source={
            __DEV__
              ? { html: this.state.html }
              : { uri: Environment.cdnUrl + '/static/html/rich_editor.html' }
          }
          originWhitelist={['*']}
          onMessage={this.onMessage}
          scrollEnabled={false}
          onError={this.onWebViewError}
          showsVerticalScrollIndicator={false}
        />
        <ImagePickMenu onSelect={this.onImagePick} ref={this.imagePick} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  webView: {
    height: Dimensions.get('window').height / 1.5,
  },
})
