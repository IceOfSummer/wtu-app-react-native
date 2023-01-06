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
    confirmOrderDrawerRef.current?.showDrawer()
  }

  const onOrderCancel = () => {
    props.setOrder({
      ...props.order,
      status: OrderStatus.FAIL,
    })
    setHideControl(true)
  }

  const onOrderConfirm = () => {
    props.setOrder({
      ...props.order,
      status: OrderStatus.DONE,
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
        order={props.order}
        drawerRef={cancelOrderDrawerRef}
        onOrderCancel={onOrderCancel}
      />
      <ConfirmOrderDrawer
        onOrderConfirm={onOrderConfirm}
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
