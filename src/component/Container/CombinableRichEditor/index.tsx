import React, { useEffect, useRef, useState } from 'react'
import {
  WebViewMessageEvent,
  WebViewSource,
} from 'react-native-webview/lib/WebViewTypes'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Environment from '../../../utils/Environment'
import Toast from 'react-native-root-toast'
import WebView from 'react-native-webview'
import { getLogger } from '../../../utils/LoggerUtils'
import ConditionHideContainer from '../ConditionHideContainer'
import ColorItem from './component/ColorItem'
import ToolBarItem from './component/ToolBarItem'
import ImagePickMenu, {
  ImageProperty,
} from '../../Drawer/BottomMenu/ImagePickMenu'
import Loading from '../../Loading'
import ImageUploadUtils from '../../../utils/ImageUploadUtils'

const logger = getLogger('/components/Container/CombinableRichEditor')

interface CombinableRichEditorProps {
  maxHeight?: number
  onFocus?: () => void
  onBlur?: () => void
  disableKeyboardAvoid?: boolean
}

interface CombinableRichEditorState {
  source?: any
}

/**
 * 从WebView可能会发送来的消息
 */
interface WebViewMessageType {
  onFocus: undefined
  onBlur: undefined
  content: EditorData
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

/**
 * 从WebView发送来的消息格式
 */
type WebViewMessage<T extends keyof WebViewMessageType> = {
  type: T
  data: WebViewMessageType[T]
}

async function getSource(): Promise<WebViewSource> {
  if (__DEV__) {
    const source = await fetch(
      Image.resolveAssetSource(
        require('../../../assets/html/rich_editor_v2.html')
      ).uri
    )
    return {
      html: await source.text(),
    }
  } else {
    return {
      uri: Environment.cdnUrl + '/static/html/rich_editor_v2.html',
    }
  }
}

/**
 * 可组合的富文本编辑器。
 * <p>
 * 该编辑器的控制组件和编辑组件是独立分开的。
 * @see CombinableRichEditorToolBar 单独的富文本控制组件
 */
export default class CombinableRichEditor extends React.Component<
  CombinableRichEditorProps,
  CombinableRichEditorState
> {
  webView = React.createRef<WebView>()

  public insertImage(url: string) {
    logger.info('insert image: ' + url)
    this.webView.current?.injectJavaScript(
      `insertImage('${Environment.cdnUrl + url}')`
    )
  }

  constructor(props: CombinableRichEditorProps) {
    super(props)
    this.state = {}
    getSource()
      .then(s => {
        this.setState({
          source: s,
        })
      })
      .catch(e => {
        Toast.show('加载富文本编辑器失败: ' + e.message)
      })
  }

  onMessage = ({ nativeEvent }: WebViewMessageEvent) => {
    logger.debug('receive webview message: ' + nativeEvent.data)
    let msg: WebViewMessage<any>
    try {
      msg = JSON.parse(nativeEvent.data)
    } catch (e) {
      logger.error('parse message failed, content: ' + nativeEvent.data)
      return
    }
    const type = msg.type as keyof WebViewMessageType
    switch (type) {
      case 'onFocus':
        this.props.onFocus?.()
        return
      case 'onBlur':
        this.props.onBlur?.()
        return
      case 'content':
        this.contentResolveCallback?.(msg.data)
        this.contentResolveCallback = undefined
        return
      default:
        logger.warn('unknown message type, data: ' + type)
    }
  }

  contentResolveCallback: ((content: EditorData) => void) | undefined

  public getContent() {
    return new Promise<EditorData>(resolve => {
      this.contentResolveCallback = resolve
      this.webView.current?.injectJavaScript('rnGetContent()')
    })
  }

  public injectScript(script: string) {
    this.webView.current?.injectJavaScript(script)
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <WebView
          showsHorizontalScrollIndicator={false}
          ref={this.webView}
          onMessage={this.onMessage}
          containerStyle={{
            maxHeight: this.props.maxHeight,
            flex: 1,
            zIndex: 1,
          }}
          source={this.state.source}
        />
      </KeyboardAvoidingView>
    )
  }
}

interface CombinableRichEditorToolBarProps {
  richEditorRef: React.RefObject<CombinableRichEditor>
  /**
   * 提供键盘高度，若不提供，则在稍后撑起键盘时进行测量.
   * <p>
   * 在测量之前以下格式化不可用：
   * - color
   */
  keyboardHeight?: number
  visible?: boolean
}

enum ToolbarLabel {
  NONE,
  COLOR,
}

/**
 * 富文本控制器
 */
export const CombinableRichEditorToolBar: React.FC<
  CombinableRichEditorToolBarProps
> = props => {
  const [colorLabelVisible, setColorLabelVisible] = useState(false)
  // 当该标致为true时，在键盘收起时应该关闭label
  const closeLabelFlag = useRef<boolean>(true)
  const [labelVisible, setLabelVisible] = useState(false)
  const keyboardHeight = useRef(props.keyboardHeight ?? 0)
  const imagePick = useRef<ImagePickMenu>(null)
  const [currentLabelActive, setCurrentLabelActive] = useState<ToolbarLabel>(
    ToolbarLabel.NONE
  )

  const doFormat = (script: string) => {
    closeLabelFlag.current = true
    props.richEditorRef.current?.injectScript('quill.' + script)
  }

  const doColorFormat = (color: string) => {
    props.richEditorRef.current?.injectScript(
      `quill.format('color','${color}')`
    )
  }

  const onColorLabelIconPress = () => {
    setCurrentLabelActive(ToolbarLabel.COLOR)
    closeLabelFlag.current = false
    props.richEditorRef?.current?.injectScript('quill.specialBlur()')
    setLabelVisible(true)
    setColorLabelVisible(true)
  }

  const requireImageUpload = () => {
    imagePick.current?.showDrawer()
  }

  const onImagePick = async (image: ImageProperty[]) => {
    const img = image[0]
    if (!img) {
      return
    }
    try {
      Loading.showLoading('上传图片中')
      const url = await ImageUploadUtils.uploadImageToPublicSpace(
        img.path,
        img.contentType,
        img.originFilepath
      )
      props.richEditorRef.current?.insertImage(url)
    } catch (e: any) {
      logger.error('upload image failed: ' + e.message)
      Toast.show('上传文件失败: ' + e.message)
    } finally {
      Loading.hideLoading()
    }
  }

  useEffect(() => {
    const evt1 = Keyboard.addListener('keyboardDidShow', evt => {
      keyboardHeight.current = evt.endCoordinates.height
      closeLabelFlag.current = true
      setLabelVisible(true)
    })
    const evt3 = Keyboard.addListener('keyboardDidHide', () => {
      if (closeLabelFlag.current) {
        setLabelVisible(false)
        setCurrentLabelActive(ToolbarLabel.NONE)
      }
    })
    return () => {
      evt1.remove()
      evt3.remove()
    }
  }, [])

  return (
    <View
      style={[styles.toolbar, { display: props.visible ? 'flex' : 'none' }]}>
      <View style={styles.toolbarContainer}>
        <ToolBarItem
          icon="&#xe6e4;"
          script="toggleFormat('bold',true)"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe6e5;"
          script="toggleFormat('header',1)"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe6f0;"
          script="toggleFormat('header',2)"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe6f1;"
          script="toggleFormat('italic',true)"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe6ed;"
          script="toggleFormat('underline',true)"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe6f2;"
          script="toggleFormat('list','ordered')"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe6ef;"
          script="toggleFormat('list','bullet')"
          onPress={doFormat}
        />
        <ToolBarItem
          icon="&#xe60e;"
          script="toggleFormat('strike',true)"
          onPress={doFormat}
        />
        <ToolBarItem icon="&#xe6ec;" onPress={requireImageUpload} />
        <ToolBarItem
          icon="&#xe6ee;"
          onPress={onColorLabelIconPress}
          active={currentLabelActive === ToolbarLabel.COLOR}
        />
      </View>
      <ConditionHideContainer
        hide={!labelVisible}
        style={[{ height: keyboardHeight.current }, styles.toolbarLabel]}>
        <ConditionHideContainer hide={!colorLabelVisible}>
          <Text style={styles.colorLabelHeader}>字体颜色</Text>
          <View style={styles.colorBarItem}>
            <ColorItem onPress={doColorFormat} color="black" />
            <ColorItem onPress={doColorFormat} color="chartreuse" />
            <ColorItem onPress={doColorFormat} color="red" />
            <ColorItem onPress={doColorFormat} color="#6495ED" />
            <ColorItem onPress={doColorFormat} color="coral" />
            <ColorItem onPress={doColorFormat} color="magenta" />
            <ColorItem onPress={doColorFormat} color="#8A2BE2" />
            <ColorItem onPress={doColorFormat} color="aquamarine" />
          </View>
        </ConditionHideContainer>
      </ConditionHideContainer>
      <ImagePickMenu ref={imagePick} onSelect={onImagePick} />
    </View>
  )
}

const styles = StyleSheet.create({
  toolbarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#00000015',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  colorBarItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  toolbar: {
    width: '100%',
    zIndex: 2,
    bottom: 0,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  toolbarLabel: {
    backgroundColor: global.colors.backgroundColor,
    paddingTop: 10,
  },
  colorLabelHeader: {
    margin: 10,
  },
})
