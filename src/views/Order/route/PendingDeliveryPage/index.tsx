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
  const [hideControl, setHideControl] = useState(false)

  const openCancelDrawer = () => {
    cancelOrderDrawer.current?.showDrawer()
  }

  const onOrderCancel = () => {
    props.setOrder({
      ...props.order,
      status: OrderStatus.FAIL,
    })
    setHideControl(true)
  }

  return (
    <View style={styles.container}>
      <ConditionHideContainer hide={hideControl}>
        <ControlButton
          onPress={openCancelDrawer}
          title="取消订单"
          color={global.colors.error_color}
        />
      </ConditionHideContainer>
      <CancelOrderDrawer
        order={props.order}
        drawerRef={cancelOrderDrawer}
        onOrderCancel={onOrderCancel}
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
