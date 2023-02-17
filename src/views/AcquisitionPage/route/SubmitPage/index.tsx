import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import CombinableRichEditor, {
  CombinableRichEditorToolBar,
  EditorData,
} from '../../../../component/Container/CombinableRichEditor'
import NavigationHeader from '../../../../component/Container/NavigationHeader'
import { StackActions, useNavigation } from '@react-navigation/native'
import { useFormChecker } from '../../../../component/Input'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../../../utils/LoggerUtils'
import { insertAcquisition } from '../../../../api/server/acquisition'
import Loading from '../../../../component/Loading'
import { NavigationProp } from '@react-navigation/core/src/types'
import { AcquisitionSubmitPageRoute, SUBMIT_SUCCESS_PAGE } from '../../index'

const logger = getLogger('views/AcquisitionPage/route/SubmitPage')

const SubmitPage: React.FC = () => {
  const editor = useRef<CombinableRichEditor>(null)
  const [toolbarVisible, setToolbarVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [contract, setContract] = useState('')
  const [expectPrice, setExpectPrice] = useState('')
  const titleInputRef = useRef<SimpleInput>(null)
  const contractInputRef = useRef<SimpleInput>(null)
  const expectPriceInputRef = useRef<SimpleInput>(null)

  const formCheck = useFormChecker([
    { ref: titleInputRef, maxLength: 30, name: '物品名称', minLength: 4 },
    { ref: contractInputRef, maxLength: 60, name: '联系方式', minLength: 4 },
    {
      ref: expectPriceInputRef,
      maxLength: 20,
      name: '预期价格',
      allowEmpty: true,
    },
  ])

  const nav = useNavigation<NavigationProp<AcquisitionSubmitPageRoute>>()
  const onRichEditorFocus = () => {
    setToolbarVisible(true)
  }

  const onRichEditorBlur = () => {
    setToolbarVisible(false)
  }

  const onSubmit = async () => {
    if (formCheck.checkForm().length > 0) {
      return
    }
    let content: EditorData | undefined
    try {
      content = await editor.current?.getContent()
    } catch (e: any) {
      logger.error('get rich editor content failed: ' + e.message)
    }
    if (!content) {
      Toast.show('发生未知错误，请稍后再试')
      return
    }
    if (content.content.length >= 5000) {
      Toast.show('描述信息太长!')
      return
    }
    Loading.showLoading()
    insertAcquisition({
      title,
      contract,
      expectPrice,
      description: content.content,
    })
      .then(r => {
        // success
        nav.dispatch(
          StackActions.replace(SUBMIT_SUCCESS_PAGE, { acquisitionId: r.data })
        )
      })
      .catch(e => {
        Toast.show('上传失败，' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <View style={styles.container}>
      <NavigationHeader title="收购" navigation={nav}>
        <Text style={styles.submitText} onPress={onSubmit}>
          提交
        </Text>
      </NavigationHeader>
      <SimpleInput
        ref={titleInputRef}
        textInputProps={{ placeholder: '要收购的物品名称' }}
        onChangeText={setTitle}
      />
      <SimpleInput
        ref={contractInputRef}
        textInputProps={{ placeholder: '联系方式' }}
        onChangeText={setContract}
      />
      <SimpleInput
        ref={expectPriceInputRef}
        textInputProps={{ placeholder: '预期价格(不填默认当面议价)' }}
        onChangeText={setExpectPrice}
      />
      <CombinableRichEditor
        placeholder="填写其它信息"
        ref={editor}
        disableKeyboardAvoid
        onFocus={onRichEditorFocus}
        onBlur={onRichEditorBlur}
      />
      <CombinableRichEditorToolBar
        richEditorRef={editor}
        visible={toolbarVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.colors.boxBackgroundColor,
    paddingHorizontal: 10,
  },
  submitText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default SubmitPage
