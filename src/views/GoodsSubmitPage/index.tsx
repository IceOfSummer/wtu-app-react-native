import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Divider from '../../component/Container/Divider'
import SimpleInput from '../../component/Input/SimpleInput'
import ImageUploadContainer from '../../component/Input/ImageUploadContainer'
import { SpringScrollView } from 'react-native-spring-scrollview'
import ColorfulButton from '../../component/Button/ColorfulButton'
import { getSellingCount } from '../../api/server/commodity'
import { getLogger } from '../../utils/LoggerUtils'
import { useFormChecker } from '../../component/Input'
import fs from 'react-native-fs'
import cos, { putObject } from '../../api/server/cos'

const logger = getLogger('/views/GoodsSubmitPage')
const MAX_DESCRIPTION_LENGTH = 100
const LOADING = -1
const LOAD_FAILED = -2
const MAX_ACTIVE_COMMODITY = 10
/**
 * 商品提交页面，需要提前保证用户已经登录
 * @constructor
 */
const GoodsSubmitPage: React.FC = () => {
  // -1: 加载中, -2: 加载失败
  const [sellingCount, setSellingCount] = useState(LOADING)
  const [description, setDescription] = useState('')
  const goodsNameInput = useRef<SimpleInput>(null)
  const priceInput = useRef<SimpleInput>(null)
  const decorationInput = useRef<SimpleInput>(null)
  const tradeLocationInput = useRef<SimpleInput>(null)
  const previewImageInput = useRef<ImageUploadContainer>(null)
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
    const uri = previewImageRef?.getSelectedImage()[0].uri
    fs.readFile(uri!).then(res => {
      putObject(res, '/images/1/test.png')
    })
    if (!previewImageRef || formManager.checkForm().length !== 0) {
      return
    }
    // 上传图片
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
      />
      <SimpleInput
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
        textInputProps={{ placeholder: '交易地点(如送货上门)', maxLength: 20 }}
        ref={tradeLocationInput}
      />
      <SimpleInput
        ref={decorationInput}
        textInputProps={{
          placeholder: '商品描述',
          keyboardType: 'numeric',
          multiline: true,
          numberOfLines: 5,
          textAlignVertical: 'top',
          maxLength: MAX_DESCRIPTION_LENGTH,
          onChangeText: setDescription,
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
        title="预览图"
        limit={6}
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
