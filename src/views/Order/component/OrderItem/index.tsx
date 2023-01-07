import React, { useState } from 'react'
import {
  OrderPreview,
  OrderStatus,
  OrderType,
} from '../../../../api/server/order'
import { StyleSheet, Text, View } from 'react-native'
import BetterImage from '../../../../component/Container/BetterImage'
import { formatTimestamp } from '../../../../utils/DateUtils'
import { RouterTypes, USER_INFO_PAGE } from '../../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import BaseContainer from '../../../../component/Container/BaseContainer'
import Icons from '../../../../component/Icons'
import { OrderControlComponentProps } from '../PageAdapter'
import { ORDER_DETAIL_PAGE, OrderRouteParam } from '../../index'

interface OrderItemProps {
  order: OrderPreview
  onPress?: () => void
  control?: React.ComponentType<OrderControlComponentProps>
}

/**
 * 用于待收货和待发货
 */
const OrderItem: React.FC<OrderItemProps> = props => {
  const [order, setOrder] = useState(props.order)
  const nav = useNavigation<NavigationProp<RouterTypes & OrderRouteParam>>()

  const ControlComponent = props.control ?? EmptyControl

  let statusText = ''
  let statusTextColor: string
  switch (order.status) {
    case OrderStatus.TRADING:
      statusTextColor = global.colors.primaryColor
      statusText = '交易中'
      break
    case OrderStatus.FAIL:
      statusTextColor = global.colors.error_color
      statusText = '交易失败'
      break
    case OrderStatus.DONE:
      statusTextColor = global.colors.success_color
      statusText = '交易完成'
      break
  }

  const toUserInfo = () => {
    nav.navigate(USER_INFO_PAGE, { id: props.order.tradeUid })
  }

  const toDetail = () => {
    nav.navigate(ORDER_DETAIL_PAGE, { oid: props.order.orderId })
  }

  return (
    <BaseContainer style={styles.container} onPress={toDetail}>
      <View style={styles.header}>
        <Text style={styles.headerText} onPress={toUserInfo}>
          <Icons iconText="&#xe767;" />与{props.order.tradeName}的交易
          <Icons iconText="&#xe61c;" />
        </Text>
        <Text style={{ color: statusTextColor }}>{statusText}</Text>
      </View>
      <View style={global.styles.flexRow}>
        <View style={styles.image}>
          <BetterImage uri={order.previewImage} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={styles.rightTextContainer}>
            <Text style={styles.itemNameText} numberOfLines={2}>
              {order.name}
            </Text>
          </View>
          <View style={[styles.text, styles.buttonLinkContainer]}>
            <Text style={styles.timeText}>
              {formatTimestamp(props.order.createTime)}
            </Text>
            <Text
              style={[
                global.styles.errorTipText,
                { marginLeft: global.styles.$spacing_row_base },
              ]}>
              {order.price * order.count}￥({order.price}￥ × {order.count}件)(
              {props.order.type === OrderType.BUY ? '买' : '卖'})
            </Text>
          </View>
          <ControlComponent order={order} setOrder={setOrder} />
        </View>
      </View>
    </BaseContainer>
  )
}

const EmptyControl = () => null

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  headerText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    fontWeight: 'bold',
  },
  container: {
    marginVertical: 4,
    paddingHorizontal: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 4,
    overflow: 'hidden',
    resizeMode: 'stretch',
    alignSelf: 'flex-start',
  },
  rightTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerInfoText: {
    color: global.styles.$primary_color,
    textDecorationLine: 'underline',
    fontSize: 12,
  },
  text: {
    marginVertical: 3,
  },
  buttonLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelText: {
    marginLeft: 15,
    color: 'red',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  itemNameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    textAlignVertical: 'center',
  },
  timeText: {
    fontSize: global.styles.$font_size_sm,
  },
})
export default OrderItem
