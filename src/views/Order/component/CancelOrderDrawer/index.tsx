import React, { useEffect, useRef, useState } from 'react'
import {
  cancelTrade,
  OrderPreview,
  OrderStatus,
} from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import SimpleInput from '../../../../component/Input/SimpleInput'
import Loading from '../../../../component/Loading'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import { getLogger } from '../../../../utils/LoggerUtils'
import { modifyKVData } from '../../../../redux/counter/temporaryDataSlice'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'

const logger = getLogger('/views/Order/component/CancelOrderDrawer')

function getNextStatus(
  currentStatus: OrderStatus,
  isSeller?: boolean
): OrderStatus | undefined {
  if (currentStatus === OrderStatus.TRADING) {
    return isSeller ? OrderStatus.SELLER_CANCELED : OrderStatus.BUYER_CANCELED
  } else if (currentStatus === OrderStatus.BUYER_CANCELED && isSeller) {
    return OrderStatus.CANCELED_BY_BUYER
  } else if (currentStatus === OrderStatus.SELLER_CANCELED && !isSeller) {
    return OrderStatus.CANCELED_BY_SELLER
  } else if (
    currentStatus === OrderStatus.BUYER_CONFIRMED ||
    currentStatus === OrderStatus.SELLER_CONFIRMED
  ) {
    return isSeller ? OrderStatus.SELLER_CANCELED : OrderStatus.BUYER_CANCELED
  } else {
    logger.warn(
      `could not get next status, currentStatus: ${currentStatus}, isSeller: ${!!isSeller}`
    )
    return undefined
  }
}

interface CancelOrderDrawerProps {
  order?: OrderPreview
  drawerRef: React.RefObject<Drawer>
  onOrderCancel: (nextStatus: OrderStatus) => void
  isSeller?: boolean
  title: string
}

const CancelOrderDrawer: React.FC<CancelOrderDrawerProps> = props => {
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
    logger.info('canceling order...')
    const nextStatus = getNextStatus(order.status, props.isSeller)
    if (!nextStatus) {
      props.drawerRef.current?.showToast('发生了预期之外的错误！')
      return
    }
    Loading.showLoading('处理中...')
    cancelTrade(order.orderId, order.status, props.isSeller, remark)
      .then(() => {
        logger.info('cancel order success')
        props.drawerRef.current?.closeDrawer()
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
        showSingleBtnTip('订单取消成功!', '订单已取消')
        props.onOrderCancel(nextStatus)
      })
      .catch(e => {
        logger.error('cancel order failed: ' + e.message)
        remarkInputRef.current?.showErrorText('取消失败: ' + e.message)
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
            placeholder: '取消原因(可选)',
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
    color: global.colors.error_color,
    fontSize: global.styles.$font_size_base,
    fontWeight: 'bold',
  },
  submitText: {
    color: global.colors.primaryColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default CancelOrderDrawer
