import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import SimpleInput from '../../component/Input/SimpleInput'
import ColorfulButton from '../../component/Button/ColorfulButton'
import { useFormChecker } from '../../component/Input'
import { postArticle } from '../../api/server/community'
import Loading from '../../component/Loading'
import { showSingleBtnTip } from '../../native/modules/NativeDialog'
import { StackActions, useNavigation } from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, UseNavigationGeneric } from '../../router'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import RichTextEditor, {
  EditorData,
} from '../../component/Container/RichTextEditor'
import { getLogger } from '../../utils/LoggerUtils'
import { processHtml } from '../../utils/XssUtil'

const logger = getLogger('/views/PostArticlePage')

const PostArticlePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const titleInputRef = useRef<SimpleInput>(null)
  const nav = useNavigation<UseNavigationGeneric>()
  const store = useStore<ReducerTypes>()
  const richTextEditor = useRef<RichTextEditor>(null)
  const checker = useFormChecker([
    {
      name: '标题',
      maxLength: 30,
      ref: titleInputRef,
    },
  ])

  const submit = async () => {
    const errors = checker.checkForm()
    const editor = richTextEditor.current!
    if (errors.length) {
      return
    }
    logger.info('submit article')
    Loading.showLoading()
    let messageId: number
    let editorData: EditorData
    try {
      editorData = await editor.getContent()
      const contentPreview =
        editorData.text.length <= 30
          ? editorData.text
          : editorData.text.substring(0, 31) + '...'
      logger.info('get content success!')
      logger.info('content preview: ' + contentPreview)
      messageId = (
        await postArticle({
          title,
          content: processHtml(editorData.content),
          pid: 0,
          contentPreview,
        })
      ).data
    } catch (e: any) {
      logger.error('submit failed: ' + e.message)
      showSingleBtnTip('请求失败', e.message)
      return
    } finally {
      Loading.hideLoading()
    }
    const info = store.getState().serverUser.userInfo
    if (!info) {
      nav.goBack()
    } else {
      nav.dispatch(
        StackActions.replace(ARTICLE_DETAIL_PAGE, {
          prepared: {
            title,
            content: editorData.content,
            pid: 0,
            nickname: info.nickname,
            id: messageId,
            author: info.uid,
            createTime: Date.now(),
            dislike: 0,
            like: 0,
            replyCount: 0,
          },
        })
      )
    }
  }

  return (
    <View style={styles.container}>
      <SimpleInput
        ref={titleInputRef}
        textInputProps={{ placeholder: '标题' }}
        onChangeText={setTitle}
        style={{ marginBottom: 8 }}
      />
      <RichTextEditor ref={richTextEditor} />
      <ColorfulButton
        onPress={submit}
        color={global.colors.primaryColor}
        title="发布"
        style={styles.submitButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    flex: 1,
  },
  submitButton: {
    marginVertical: 20,
  },
})

export default PostArticlePage
