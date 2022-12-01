import React from 'react'
import {
  OrderDetail,
  OrderStatus,
  OrderType,
} from '../../../../api/server/order'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import BetterImage from '../../../../component/Container/BetterImage'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../../utils/DateUtils'
import { RouterTypes, USER_INFO_PAGE } from '../../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import BaseContainer from '../../../../component/Container/BaseContainer'

interface OrderItemProps {
  order: OrderDetail
  onCancel?: (order: OrderDetail) => void
}

/**
 * 用于待收货和待发货
 */
const OrderItem: React.FC<OrderItemProps> = props => {
  const { order } = props
  const nav = useNavigation<NavigationProp<RouterTypes>>()

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

  const seeSeller = () => {
    nav.navigate(USER_INFO_PAGE, {
      id: order.ownerId,
    })
  }

  const cancelOrder = () => {
    props.onCancel?.(props.order)
  }

  return (
    <BaseContainer style={styles.container}>
      <View style={styles.image}>
        <BetterImage uri={order.previewImage} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={styles.rightTextContainer}>
          <View>
            <Text style={global.styles.blobText}>{order.name}</Text>
            <KVTextContainer
              icon="&#xe662;"
              name="锁定时间"
              style={styles.text}
              value={formatTimestamp(order.createTime)}
            />
            <KVTextContainer
              icon="&#xe786;"
              name="交易地点"
              style={styles.text}
              value={order.tradeLocation}
            />
            <KVTextContainer
              icon="&#xe6e1;"
              name="交易状态"
              valueColor={statusTextColor}
              style={styles.text}
              value={statusText}
            />
          </View>
        </View>
        <View style={[styles.text, styles.buttonLinkContainer]}>
          <Pressable onPress={seeSeller}>
            <Text style={styles.sellerInfoText}>卖家信息</Text>
          </Pressable>
          {order.status === OrderStatus.TRADING ? (
            <Pressable>
              <Text style={styles.cancelText} onPress={cancelOrder}>
                {order.type === OrderType.BUY ? '不想要了' : '不想卖了'}
              </Text>
            </Pressable>
          ) : null}
          <Text
            style={[
              global.styles.errorTipText,
              { marginLeft: global.styles.$spacing_row_base },
            ]}>
            {order.price * order.count}￥({order.price}￥ × {order.count}件)
          </Text>
        </View>
      </View>
    </BaseContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'stretch',
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
})
export default OrderItem
