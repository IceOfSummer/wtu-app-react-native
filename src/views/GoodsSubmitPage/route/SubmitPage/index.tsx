import React, { useRef, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import ImageUploadContainer from '../../../../component/Input/ImageUploadContainer'
import { checkNumber, useFormChecker } from '../../../../component/Input'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import Loading from '../../../../component/Loading'
import {
  getUserspaceImagePath,
  requireUserSpaceUploadSecret,
} from '../../../../api/server/cos'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { SUBMIT_PAGE, SubmitPageRouteTypes, SUCCESS_PAGE } from '../../index'
import { getFilenameFromUrl } from '../../../../utils/PathUtils'
import { createCommodity } from '../../../../api/server/commodity'
import Divider from '../../../../component/Container/Divider'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../../../utils/LoggerUtils'
import CombinableRichEditor, {
  CombinableRichEditorToolBar,
} from '../../../../component/Container/CombinableRichEditor'
import NavigationHeader from '../../../../component/Container/NavigationHeader'

const logger = getLogger('/views/GoodsSubmitPage/route/SubmitPage')

/**
 * 商品提交页面，需要提前保证用户已经登录
 */
const SubmitPage: React.FC = () => {
  const nav = useNavigation<NavigationProp<SubmitPageRouteTypes>>()
  const route = useRoute<RouteProp<SubmitPageRouteTypes, typeof SUBMIT_PAGE>>()
  const uid = route.params.uid
  const [commodityName, setCommodityName] = useState('')
  const [commodityPrice, setCommodityPrice] = useState('')
  const [tradeLocation, setTradeLocation] = useState('')
  const [commodityCount, setCommodityCount] = useState('')
  const [editorToolbarVisible, setEditorToolbarVisible] = useState(false)
  const goodsNameInput = useRef<SimpleInput>(null)
  const countInput = useRef<SimpleInput>(null)
  const priceInput = useRef<SimpleInput>(null)
  const tradeLocationInput = useRef<SimpleInput>(null)
  const previewImageInput = useRef<ImageUploadContainer>(null)
  const detailImageInput = useRef<ImageUploadContainer>(null)
  const inputRef = useRef<CombinableRichEditor>(null)

  const formManager = useFormChecker<string>([
    {
      name: '商品名称',
      ref: goodsNameInput,
      maxLength: 50,
    },
    {
      name: '数量',
      ref: countInput,
      maxLength: 9,
      check: checkNumber({
        min: 1,
        max: 10000,
        noDecimal: true,
      }),
    },
    {
      name: '价格',
      ref: priceInput,
      check: checkNumber({ min: 0, max: 10000 }),
    },
    { name: '交易地点', ref: tradeLocationInput },
  ])

  const submitCommodity = async () => {
    logger.info('submit commodity...... checking param')
    const previewImageRef = previewImageInput.current
    const detailImageRef = detailImageInput.current
    if (
      formManager.checkForm().length !== 0 ||
      !detailImageRef ||
      !previewImageRef
    ) {
      return
    }
    const decoration = await inputRef.current?.getContent()
    if (!decoration) {
      Toast.show('描述不可为空！')
      return
    }
    const html = decoration.content
    if (html.length === 0) {
      Toast.show('描述不可为空！')
      return
    } else if (html.length >= 10000) {
      Toast.show('描述不可以超过1万个字')
      return
    }
    const preview = previewImageRef.getNotUploadedImages()
    if (previewImageRef.getUploadedImageCount() === 0 && preview.length === 0) {
      Toast.show('预览图不能为空')
      return
    }
    let count = preview.length + detailImageRef.getNotUploadedImages().length
    try {
      logger.info('trying to upload images')
      Loading.showLoading('准备上传图片')
      const { data } = await requireUserSpaceUploadSecret(count, 'image/png')
      previewImageRef.bindUploadSign(data)
      detailImageRef.bindUploadSign(data, 1)
      Loading.showLoading('上传预览图中')
      await previewImageRef.uploadImage()
      await detailImageRef.uploadImage((current, total) => {
        Loading.showLoading(`上传详细图中(${current}/${total})`)
      })
      logger.info('upload images success!')
      Loading.showLoading('发布商品中')
      const { data: commodityId } = await uploadCommodity(html)
      // 跳转到成功页面
      nav.navigate(SUCCESS_PAGE, { commodityId })
    } catch (e: any) {
      showSingleBtnTip('上传失败', e.message)
      logger.error('upload commodity failed: ' + e.message)
    } finally {
      Loading.hideLoading()
    }
  }

  /**
   * 发布商品。请确保所有图片都上传完毕后再调用该函数
   */
  function uploadCommodity(html: string) {
    // 太懒狗了，直接用断言了
    const previewImage = previewImageInput.current!.getSelectedImage()[0]
    const imagesArr = detailImageInput.current
      ?.getSelectedImage()
      .map(value =>
        getUserspaceImagePath(
          uid,
          getFilenameFromUrl(value.sign?.path) + '.webp'
        )
      )
    let detailImage: string | undefined =
      imagesArr && imagesArr.length > 0 ? JSON.stringify(imagesArr) : undefined
    if (!detailImage) {
      // 直接使用预览图当做详细图
      detailImage = JSON.stringify([
        getUserspaceImagePath(
          uid,
          getFilenameFromUrl(previewImage.sign?.path) + '.webp'
        ),
      ])
    }
    return createCommodity({
      name: commodityName,
      previewImage: getUserspaceImagePath(
        uid,
        getFilenameFromUrl(previewImage.sign?.path) + '.webp'
      ),
      images: detailImage,
      price: Number.parseInt(commodityPrice, 10),
      description: html,
      tradeLocation: tradeLocation,
      count: Number.parseInt(commodityCount, 10),
    })
  }

  const onRichEditorFocus = () => {
    setEditorToolbarVisible(true)
  }

  const onRichEditorBlur = () => {
    setEditorToolbarVisible(false)
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationHeader
        title="提交商品"
        backgroundColor={global.colors.boxBackgroundColor}
        navigation={nav}>
        <Text style={styles.submitText} onPress={submitCommodity}>
          提交
        </Text>
      </NavigationHeader>
      <ScrollView style={styles.container}>
        <SimpleInput
          textInputProps={{ placeholder: '商品名称', maxLength: 50 }}
          ref={goodsNameInput}
          onChangeText={setCommodityName}
        />
        <SimpleInput
          onChangeText={setCommodityCount}
          textInputProps={{ placeholder: '数量', keyboardType: 'numeric' }}
          rowTipText="件"
          rowTipTextStyle={styles.tipText}
          ref={countInput}
        />
        <SimpleInput
          onChangeText={setCommodityPrice}
          textInputProps={{
            placeholder: '价格',
            keyboardType: 'numeric',
            maxLength: 8,
          }}
          rowTipText="元"
          rowTipTextStyle={styles.tipText}
          ref={priceInput}
        />
        <SimpleInput
          onChangeText={setTradeLocation}
          textInputProps={{
            placeholder: '交易地点(如送货上门)',
            maxLength: 20,
          }}
          ref={tradeLocationInput}
        />
        <ImageUploadContainer
          uid={uid}
          title="预览图"
          limit={1}
          tipMessage="用户在搜索列表中最先看到的就是预览图了!图片会被压缩为正方形的图片，请提前确保尺寸"
          imagePreviewResizeMode="stretch"
          ref={previewImageInput}
        />
        <Divider />
        <ImageUploadContainer
          uid={uid}
          title="详细图"
          limit={6}
          ref={detailImageInput}
          tipMessage="用户在点进商品后会看到的详细展示图，若不上传，默认使用预览图"
        />
        <Divider />
        <View style={styles.richTextContainer}>
          <Text style={styles.titleText}>描述</Text>
        </View>
        <Divider />
        <CombinableRichEditor
          styles={styles.editor}
          disableKeyboardAvoid
          nestedScrollEnabled
          ref={inputRef}
          onFocus={onRichEditorFocus}
          onBlur={onRichEditorBlur}
        />
        <View style={{ height: 40, width: '100%' }} />
      </ScrollView>
      <CombinableRichEditorToolBar
        richEditorRef={inputRef}
        visible={editorToolbarVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  editor: {
    height: Dimensions.get('window').height / 2,
    flex: undefined,
  },
  container: {
    borderTopColor: global.colors.borderColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: global.colors.boxBackgroundColor,
    paddingHorizontal: global.styles.$spacing_row_base,
    overflow: 'hidden',
    flex: 1,
  },
  tipText: {
    color: global.colors.textColor,
  },
  textLengthIndicator: {
    alignSelf: 'flex-end',
  },
  submitButtonContainer: {
    marginVertical: global.styles.$spacing_col_base,
  },
  titleText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    marginVertical: 6,
  },
  richTextContainer: {
    marginVertical: 8,
  },
  submitText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
    marginRight: 6,
  },
})

export default SubmitPage
