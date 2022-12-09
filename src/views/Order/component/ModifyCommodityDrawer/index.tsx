import React, { useRef, useState } from 'react'
import {
  ProcessedCommodity,
  updateCommodity,
} from '../../../../api/server/commodity'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import { checkNumber, useFormChecker } from '../../../../component/Input'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import { Commodity } from '../../../../api/server/types'
import Loading from '../../../../component/Loading'
import { getLogger } from '../../../../utils/LoggerUtils'

const logger = getLogger('/views/Order/component/ModifyCommodityDrawer')

interface ModifyCommodityDrawerProps {
  commodity?: ProcessedCommodity
  drawerRef: React.RefObject<Drawer>
  onUpdate?: (update: Partial<Commodity>) => void
}

const ModifyCommodityDrawer: React.FC<ModifyCommodityDrawerProps> = props => {
  const { commodity } = props
  const close = () => {
    props.drawerRef.current?.closeDrawer()
  }
  return (
    <Drawer ref={props.drawerRef}>
      {commodity ? (
        <Content {...commodity} closeDrawer={close} onUpdate={props.onUpdate} />
      ) : null}
    </Drawer>
  )
}

const Content: React.FC<
  ProcessedCommodity & {
    closeDrawer: () => void
    onUpdate?: (commodity: Partial<Commodity>) => void
  }
> = props => {
  const [commodityName, setCommodityName] = useState(props.name)
  const [tradeLocation, setTradeLocation] = useState(props.tradeLocation)
  const [price, setPrice] = useState(props.price.toString())
  const [description, setDescription] = useState(props.description)
  const commodityNameRef = useRef<SimpleInput>(null)
  const tradeLocationRef = useRef<SimpleInput>(null)
  const priceRef = useRef<SimpleInput>(null)
  const descriptionRef = useRef<SimpleInput>(null)
  const checker = useFormChecker([
    {
      ref: commodityNameRef,
      name: '商品名称',
      maxLength: 3000,
    },
    {
      name: '交易地点',
      ref: tradeLocationRef,
      maxLength: 50,
    },
    {
      name: '价格',
      ref: priceRef,
      check: checkNumber({ min: 0, max: 1000000 }),
    },
    {
      name: '描述',
      ref: descriptionRef,
      maxLength: 255,
    },
  ])
  const onSubmit = () => {
    logger.info('trying to update commodity with')
    const errors = checker.checkForm()
    if (errors.length) {
      logger.error('found input errors:')
      errors.forEach(value => logger.error(value.reason))
      return
    }
    const requestParam: Partial<Commodity> = {}
    let updateCount = 0
    const pri = Number.parseInt(price, 10)
    if (pri !== props.price) {
      updateCount++
      requestParam.price = pri
    }
    if (commodityName !== props.name) {
      updateCount++
      requestParam.name = commodityName
    }
    if (tradeLocation !== props.tradeLocation) {
      updateCount++
      requestParam.tradeLocation = tradeLocation
    }
    if (description !== props.description) {
      updateCount++
      requestParam.description = description
    }
    logger.warn('no update available')
    if (updateCount === 0) {
      showSingleBtnTip('更新失败', '请至少修改一项')
      return
    }
    Loading.showLoading()
    logger.info('sending request...')
    updateCommodity(props.commodityId, requestParam)
      .then(() => {
        showSingleBtnTip('更新成功', '')
        logger.info('update success, param: ')
        logger.info(requestParam)
        // 传id, 好用来更新
        requestParam.commodityId = props.commodityId
        props.onUpdate?.(requestParam)
      })
      .catch(e => {
        logger.error('update failed: ' + e.message)
        showSingleBtnTip('更新失败', e.message)
      })
      .finally(() => {
        props.closeDrawer()
        Loading.hideLoading()
      })
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[global.styles.blobText, styles.titleText]}>修改商品</Text>
        <Text
          style={[global.styles.primaryTipText, styles.titleText]}
          onPress={onSubmit}>
          提交
        </Text>
      </View>
      <View>
        <View style={styles.inputContainer}>
          <Text>商品名称: </Text>
          <SimpleInput
            ref={commodityNameRef}
            textInputProps={{ value: commodityName }}
            onChangeText={setCommodityName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>交易地点: </Text>
          <SimpleInput
            ref={tradeLocationRef}
            textInputProps={{ value: tradeLocation }}
            onChangeText={setTradeLocation}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>价格: </Text>
          <SimpleInput
            ref={priceRef}
            textInputProps={{
              value: price,
              keyboardType: 'numeric',
            }}
            rowTipText="元"
            onChangeText={setPrice}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>描述: </Text>
          <SimpleInput
            ref={descriptionRef}
            textInputProps={{
              value: description,
              keyboardType: 'numeric',
              multiline: true,
              textAlignVertical: 'top',
              numberOfLines: 5,
            }}
            onChangeText={setDescription}
          />
        </View>
        <View>
          <Text style={global.styles.infoTipText}>预览图等无法修改</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: global.styles.$spacing_col_lg,
  },
  titleText: {
    fontSize: 16,
  },
  inputContainer: {
    marginVertical: global.styles.$spacing_row_sm,
  },
})

export default ModifyCommodityDrawer
