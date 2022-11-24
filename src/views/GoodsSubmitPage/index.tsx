import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from '../../component/Container/Divider'
import SimpleInput from '../../component/Input/SimpleInput'
import ImageUploadContainer from '../../component/Input/ImageUploadContainer'
import { SpringScrollView } from 'react-native-spring-scrollview'
import ColorfulButton from '../../component/Button/ColorfulButton'
import { createCommodity, getSellingCount } from '../../api/server/commodity'
import { getLogger } from '../../utils/LoggerUtils'
import { useFormChecker } from '../../component/Input'
import { requireUserSpaceUploadSecret } from '../../api/server/cos'
import { quickShowErrorTip } from '../../native/modules/NativeDialog'
import Loading from '../../component/Loading'

const logger = getLogger('/views/GoodsSubmitPage')
const MAX_DESCRIPTION_LENGTH = 100
const LOADING = -1
const LOAD_FAILED = -2
const MAX_ACTIVE_COMMODITY = 10
/**
 * 商品提交页面，需要提前保证用户已经登录
 */
const GoodsSubmitPage: React.FC = () => {
  const [commodityName, setCommodityName] = useState('')
  const [commodityPrice, setCommodityPrice] = useState('')
  const [tradeLocation, setTradeLocation] = useState('')
  // -1: 加载中, -2: 加载失败
  const [sellingCount, setSellingCount] = useState(LOADING)
  const [description, setDescription] = useState('')
  const goodsNameInput = useRef<SimpleInput>(null)
  const priceInput = useRef<SimpleInput>(null)
  const decorationInput = useRef<SimpleInput>(null)
  const tradeLocationInput = useRef<SimpleInput>(null)
  const previewImageInput = useRef<ImageUploadContainer>(null)
  const detailImageInput = useRef<ImageUploadContainer>(null)
  const formManager = useFormChecker<string>([
    {
      name: '商品名称',
      ref: goodsNameInput,
      maxLength: 50,
    },
    {
      name: '价格',
      ref: priceInput,
      check(text) {
        let price = Number.parseInt(text, 10)
        if (Number.isNaN(price)) {
          return '无效的价格'
        }
        if (price < 0) {
          return '价格不可为负数'
        }
        return undefined
      },
    },
    { name: '描述', ref: decorationInput },
    { name: '交易地点', ref: tradeLocationInput },
  ])

  const submitCommodity = async () => {
    const previewImageRef = previewImageInput.current
    const detailImageRef = detailImageInput.current
    if (
      formManager.checkForm().length !== 0 ||
      !detailImageRef ||
      !previewImageRef
    ) {
      return
    }
    const preview = previewImageRef.getNotUploadedImages()
    if (previewImageRef.getUploadedImageCount() === 0 && preview.length === 0) {
      quickShowErrorTip('上传失败', '预览图不可为空')
      return
    }
    const detail = detailImageRef.getNotUploadedImages()
    if (detailImageRef.getUploadedImageCount() === 0 && detail.length === 0) {
      quickShowErrorTip('上传失败', '请至少上传一张详细图')
      return
    }
    let count = preview.length + detail.length
    requireUserSpaceUploadSecret(count, 'image/png')
      .then(async r => {
        const infos = r.data.signs
        previewImageRef.bindUploadSign(infos)
        detailImageRef.bindUploadSign(infos, 1)
        // start upload
        Loading.showLoading('上传预览图中...')
        await previewImageRef.uploadImage(r.data.token)
        await detailImageRef.uploadImage(r.data.token, (current, total) => {
          Loading.showLoading(`上传详细图中(${current}/${total})`)
        })
        // 图片上传完毕，上传整个表单
        Loading.showLoading('发布商品中...')
        await uploadCommodity()
      })
      .catch(e => {
        quickShowErrorTip('上传图片失败', e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  /**
   * 发布商品。请确保所有图片都上传完毕后再调用该函数
   */
  function uploadCommodity() {
    // 太懒狗了，直接用断言了
    const previewImage = previewImageInput.current!.getSelectedImage()[0]
    const images = JSON.stringify(
      detailImageInput
        .current!.getSelectedImage()
        .map(value => value.sign?.path)
    )
    return createCommodity({
      name: commodityName,
      previewImage: previewImage.sign!.path!,
      images,
      price: Number.parseInt(commodityPrice, 10),
      description,
      tradeLocation: tradeLocation,
    })
  }

  useEffect(() => {
    getSellingCount()
      .then(resp => {
        setSellingCount(resp.data)
      })
      .catch(e => {
        setSellingCount(LOAD_FAILED)
        logger.error('get selling count failed: ' + e.message)
      })
  }, [])

  return (
    <SpringScrollView style={styles.container}>
      <SimpleInput
        textInputProps={{ placeholder: '商品名称', maxLength: 50 }}
        ref={goodsNameInput}
        onChangeText={setCommodityName}
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
        textInputProps={{ placeholder: '交易地点(如送货上门)', maxLength: 20 }}
        ref={tradeLocationInput}
      />
      <SimpleInput
        ref={decorationInput}
        onChangeText={setDescription}
        textInputProps={{
          placeholder: '商品描述',
          keyboardType: 'numeric',
          multiline: true,
          numberOfLines: 5,
          textAlignVertical: 'top',
          maxLength: MAX_DESCRIPTION_LENGTH,
        }}>
        <Text
          style={[
            styles.textLengthIndicator,
            {
              color:
                description.length > MAX_DESCRIPTION_LENGTH
                  ? global.colors.error_color
                  : undefined,
            },
          ]}>
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </Text>
      </SimpleInput>
      <ImageUploadContainer
        title="预览图"
        limit={1}
        tipMessage="用户在搜索列表中最先看到的就是预览图了!图片会被压缩为正方形的图片，请提前确保尺寸"
        imagePreviewResizeMode="stretch"
        ref={previewImageInput}
      />
      <Divider />
      <ImageUploadContainer
        title="详细图"
        limit={6}
        ref={detailImageInput}
        tipMessage="用户在点进商品后会看到的详细展示图，若不上传，默认使用预览图"
      />
      <Divider />
      <View style={styles.submitButtonContainer}>
        {sellingCount >= 0 ? (
          <Text style={global.styles.primaryTipText}>
            您还可以发布{sellingCount}/{MAX_ACTIVE_COMMODITY}件商品
          </Text>
        ) : null}
        <ColorfulButton
          color={global.colors.primaryColor}
          title="提交"
          onPress={submitCommodity}
        />
      </View>
    </SpringScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: global.colors.borderColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: global.colors.boxBackgroundColor,
    paddingHorizontal: global.styles.$spacing_row_base,
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
})

export default GoodsSubmitPage
