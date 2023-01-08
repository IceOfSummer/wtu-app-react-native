import React, { useRef, useState } from 'react'
import {
  getPendingDeliveryOrder,
  OrderStatus,
} from '../../../../api/server/order'
import PageAdapter, {
  OrderControlComponentProps,
} from '../../component/PageAdapter'
import { StyleSheet, View } from 'react-native'
import CancelOrderDrawer from '../../component/CancelOrderDrawer'
import Drawer from '../../../../component/Drawer'
import ControlButton from '../../component/ControlButton'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'
import ConfirmOrderDrawer from '../../component/ConfirmOrderDrawer'
import Toast from 'react-native-root-toast'

const PendingDeliveryPage: React.FC = () => {
  return (
    <PageAdapter
      loadData={getPendingDeliveryOrder}
      control={PendingDeliveryControlProps}
    />
  )
}

interface PendingDeliveryControl extends OrderControlComponentProps {}

const PendingDeliveryControlProps: React.FC<PendingDeliveryControl> = props => {
  const cancelOrderDrawer = useRef<Drawer>(null)
  const confirmOrderDrawer = useRef<Drawer>(null)
  const [hideControl, setHideControl] = useState(false)

  const openCancelDrawer = () => {
    cancelOrderDrawer.current?.showDrawer()
  }

  const openConfirmDrawer = () => {
    if (
      props.order.status === OrderStatus.BUYER_CANCELED ||
      props.order.status === OrderStatus.SELLER_CANCELED
    ) {
      Toast.show('已经被取消的订单无法再确认')
      return
    }
    confirmOrderDrawer.current?.showDrawer()
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
          onPress={openCancelDrawer}
          title="取消订单"
          color={global.colors.error_color}
        />
        <ControlButton
          title="确认发货"
          onPress={openConfirmDrawer}
          color={global.colors.primaryColor}
        />
      </ConditionHideContainer>
      <ConfirmOrderDrawer
        order={props.order}
        title="确认发货"
        isSeller
        onOrderConfirm={onOrderModify}
        drawerRef={confirmOrderDrawer}
      />
      <CancelOrderDrawer
        title="取消订单(不可撤销)"
        order={props.order}
        isSeller
        drawerRef={cancelOrderDrawer}
        onOrderCancel={onOrderModify}
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

export default PendingDeliveryPage
