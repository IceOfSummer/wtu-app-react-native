import React, { useEffect, useRef, useState } from 'react'
import {
  markTradeDone,
  OrderPreview,
  OrderStatus,
} from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import Loading from '../../../../component/Loading'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import { getLogger } from '../../../../utils/LoggerUtils'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { modifyKVData } from '../../../../redux/counter/temporaryDataSlice'

const logger = getLogger('/views/Order/component/ConfirmOrderDrawer')

function getNextStatus(
  currentStatus: OrderStatus,
  isSeller?: boolean
): OrderStatus | undefined {
  if (currentStatus === OrderStatus.TRADING) {
    return isSeller ? OrderStatus.SELLER_CONFIRMED : OrderStatus.BUYER_CONFIRMED
  } else if (currentStatus === OrderStatus.BUYER_CONFIRMED && isSeller) {
    return OrderStatus.DONE
  } else if (currentStatus === OrderStatus.SELLER_CONFIRMED && !isSeller) {
    return OrderStatus.DONE
  } else {
    logger.warn(
      `could not get next status, currentStatus: ${currentStatus}, isSeller: ${!!isSeller}`
    )
    return
  }
}

interface ConfirmOrderDrawerProps {
  order: OrderPreview
  onOrderConfirm: (nextStatus: OrderStatus) => void
  drawerRef: React.RefObject<Drawer>
  isSeller?: boolean
  title: string
}

const ConfirmOrderDrawer: React.FC<ConfirmOrderDrawerProps> = props => {
  const [remark, setRemark] = useState('')
  const remarkInputRef = useRef<SimpleInput>(null)
  const store = useStore<ReducerTypes>()

  useEffect(() => {
    setRemark('')
  }, [props.order])

  const onSubmit = () => {
    const { order } = props
    if (!order) {
      return
    }
    logger.info('confirming order...')
    const nextStatus = getNextStatus(order.status, props.isSeller)
    if (!nextStatus) {
      props.drawerRef.current?.showToast('发生了预期之外的错误！')
      return
    }
    Loading.showLoading('处理中...')
    markTradeDone(order.orderId, order.status, props.isSeller, remark)
      .then(() => {
        props.drawerRef.current?.closeDrawer()
        props.onOrderConfirm(nextStatus)
        const stat = store.getState().temporary.tradeStat
        if (nextStatus >= 100) {
          let state
          if (props.isSeller) {
            state = {
              receiveCount: stat.receiveCount,
              deliveryCount: stat.deliveryCount - 1,
            }
          } else {
            state = {
              receiveCount: stat.receiveCount - 1,
              deliveryCount: stat.deliveryCount,
            }
          }
          store.dispatch(
            modifyKVData({
              tradeStat: state,
            })
          )
        }
        showSingleBtnTip('确认收货成功!', '订单已确认收货')
        logger.info('confirm order success')
      })
      .catch(e => {
        logger.info('confirm order failed: ' + e.message)
        remarkInputRef.current?.showErrorText('确认失败: ' + e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <Drawer ref={props.drawerRef} style={styles.drawer}>
      <View style={styles.headerContainer}>
        <Text style={styles.titleText}>{props.title}</Text>
        <Text style={styles.submitText} onPress={onSubmit}>
          提交
        </Text>
      </View>
      <View style={{ width: '100%', paddingBottom: 20 }}>
        <SimpleInput
          ref={remarkInputRef}
          onChangeText={setRemark}
          textInputProps={{
            placeholder: '备注(可选)',
            multiline: true,
            numberOfLines: 4,
            textAlignVertical: 'top',
          }}
        />
      </View>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  drawer: {
    paddingHorizontal: 15,
  },
  headerContainer: {
    marginTop: global.styles.$spacing_col_lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
    fontWeight: 'bold',
  },
  submitText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})
export default ConfirmOrderDrawer
