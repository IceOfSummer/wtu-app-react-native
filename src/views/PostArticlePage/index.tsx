import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../component/Input/SimpleInput'
import ColorfulButton from '../../component/Button/ColorfulButton'
import { useFormChecker } from '../../component/Input'
import { postArticle } from '../../api/server/community'
import Loading from '../../component/Loading'
import { showSingleBtnTip } from '../../native/modules/NativeDialog'
import { useNavigation } from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, UseNavigationGeneric } from '../../router'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'

const PostArticlePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const titleInputRef = useRef<SimpleInput>(null)
  const contentInputRef = useRef<SimpleInput>(null)
  const nav = useNavigation<UseNavigationGeneric>()
  const store = useStore<ReducerTypes>()
  const checker = useFormChecker([
    {
      name: '标题',
      maxLength: 30,
      ref: titleInputRef,
    },
    {
      name: '内容',
      ref: contentInputRef,
    },
  ])

  const submit = () => {
    const errors = checker.checkForm()
    if (errors.length) {
      return
    }
    Loading.showLoading()
    postArticle({
      title,
      content,
      pid: 0,
    })
      .then(r => {
        const info = store.getState().serverUser.userInfo
        if (!info) {
          nav.goBack()
        } else {
          nav.navigate(ARTICLE_DETAIL_PAGE, {
            title,
            content,
            pid: 0,
            nickname: info.nickname,
            id: r.data,
            author: info.uid,
            createTime: Date.now(),
            dislike: 0,
            like: 0,
            replyCount: 0,
          })
        }
      })
      .catch(e => {
        showSingleBtnTip('请求失败', e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <View style={styles.container}>
      <SimpleInput
        ref={titleInputRef}
        textInputProps={{ placeholder: '标题' }}
        onChangeText={setTitle}
      />
      <SimpleInput
        ref={contentInputRef}
        textInputProps={{
          placeholder: '帖子内容',
          multiline: true,
          numberOfLines: 20,
          textAlignVertical: 'top',
          maxLength: 500,
        }}
        onChangeText={setContent}>
        <Text style={{ textAlign: 'right' }}>{content.length}/500</Text>
      </SimpleInput>
      <Text style={global.styles.infoTipText}>
        富文本编辑器将在未来上线，目前仅可使用纯文本或emoji
      </Text>
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
