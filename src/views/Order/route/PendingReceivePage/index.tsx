import React, { useRef, useState } from 'react'
import {
  getPendingReceiveOrder,
  OrderStatus,
} from '../../../../api/server/order'
import PageAdapter, {
  OrderControlComponentProps,
} from '../../component/PageAdapter'
import { StyleSheet, View } from 'react-native'
import ControlButton from '../../component/ControlButton'
import Drawer from '../../../../component/Drawer'
import CancelOrderDrawer from '../../component/CancelOrderDrawer'
import ConfirmOrderDrawer from '../../component/ConfirmOrderDrawer'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'
import Toast from 'react-native-root-toast'

/**
 * 待收货界面
 */
const PendingReceivePage: React.FC = () => {
  return (
    <PageAdapter
      loadData={getPendingReceiveOrder}
      control={PendingReceiveControl}
    />
  )
}

interface PendingReceiveControl extends OrderControlComponentProps {}

const PendingReceiveControl: React.FC<PendingReceiveControl> = props => {
  const cancelOrderDrawerRef = useRef<Drawer>(null)
  const confirmOrderDrawerRef = useRef<Drawer>(null)
  const [hideControl, setHideControl] = useState(false)
  const cancelOrder = () => {
    cancelOrderDrawerRef.current?.showDrawer()
  }
  const confirmOrder = () => {
    if (
      props.order.status === OrderStatus.BUYER_CANCELED ||
      props.order.status === OrderStatus.SELLER_CANCELED
    ) {
      Toast.show('已经被取消的订单无法再确认')
      return
    }
    confirmOrderDrawerRef.current?.showDrawer()
  }

  const onOrderModify = (nextStatus: OrderStatus) => {
    props.setOrder({
      ...props.order,
      status: nextStatus,
    })
    setHideControl(true)
  }

  return (
    <View style={styles.container}>
      <ConditionHideContainer hide={hideControl} style={global.styles.flexRow}>
        <ControlButton
          title="取消订单"
          color={global.colors.error_color}
          onPress={cancelOrder}
        />
        <ControlButton
          title="确认收货"
          onPress={confirmOrder}
          color={global.colors.primaryColor}
        />
      </ConditionHideContainer>
      <CancelOrderDrawer
        title="取消订单(不可撤销)"
        order={props.order}
        drawerRef={cancelOrderDrawerRef}
        onOrderCancel={onOrderModify}
      />
      <ConfirmOrderDrawer
        title="确认收货"
        onOrderConfirm={onOrderModify}
        order={props.order}
        drawerRef={confirmOrderDrawerRef}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

export default PendingReceivePage
