import React, { useEffect, useState } from 'react'
import {
  markTradeDone,
  OrderDetail,
  OrderStatus,
} from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../../utils/DateUtils'
import useNav from '../../../../hook/useNav'
import { COMMODITY_PAGE } from '../../../../router'
import { FinishedTrade, getFinishedTrade } from '../../../../api/server/trade'
import ColorfulButton from '../../../../component/Button/ColorfulButton'
import Loading from '../../../../component/Loading'
import NativeDialog, {
  quickShowErrorTip,
} from '../../../../native/modules/NativeDialog'

export interface OrderDetailDrawerProps {
  order?: OrderDetail
  drawerRef: React.RefObject<Drawer>
  onRequireRemove: (order: OrderDetail) => void
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = props => {
  const { order } = props

  const onMarkOrderDone = (o: OrderDetail) => {
    Loading.showLoading()
    markTradeDone(o.orderId, o.ownerId)
      .then(() => {
        props.drawerRef.current?.closeDrawer()
        NativeDialog.showDialog({
          title: '请求成功',
          message: '您已经确认收到该商品',
          hideCancelBtn: true,
        })
        props.onRequireRemove(o)
      })
      .catch(e => {
        props.drawerRef.current?.closeDrawer()
        quickShowErrorTip('请求失败', e.message)
      })
      .finally(() => {
        Loading.hideLoading()
      })
  }

  return (
    <Drawer ref={props.drawerRef} style={styles.drawer}>
      {order ? (
        <Detail order={order} onMarkOrderDone={onMarkOrderDone} />
      ) : null}
    </Drawer>
  )
}

interface DetailProps {
  order: OrderDetail
  onMarkOrderDone: (order: OrderDetail) => void
}

const Detail: React.FC<DetailProps> = props => {
  const { order } = props
  const nav = useNav()
  const [finishedTrade, setFinishedTrade] = useState<FinishedTrade>()
  const checkCommodity = () => {
    if (order.orderId) {
      nav.push(COMMODITY_PAGE, { id: order.orderId })
    }
  }

  useEffect(() => {
    if (order.status !== OrderStatus.TRADING) {
      getFinishedTrade(order.orderId)
        .then(resp => {
          setFinishedTrade(resp.data)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }, [])

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{order.name}</Text>
        <Text style={styles.checkLink} onPress={checkCommodity}>
          查看商品
        </Text>
      </View>
      <KVTextContainer
        name="创建时间"
        value={formatTimestamp(order.createTime)}
      />
      <KVTextContainer name="交易地点" value={order.tradeLocation} />
      <KVTextContainer name="购买备注" value={order.remark || '无'} />
      <KVTextContainer name="数量" value={order.count} />
      <KVTextContainer name="单价" value={order.price} />
      {order.status !== OrderStatus.TRADING && finishedTrade ? (
        <FinishedTradeShow {...finishedTrade} />
      ) : null}
      {order.status === OrderStatus.TRADING ? (
        <ColorfulButton
          style={{ marginVertical: 15 }}
          color={global.colors.primaryColor}
          title="确认已收货"
          onPress={() => props.onMarkOrderDone(order)}
        />
      ) : null}
    </View>
  )
}

const FinishedTradeShow: React.FC<FinishedTrade> = props => {
  return (
    <React.Fragment>
      <KVTextContainer
        name="完成时间"
        value={formatTimestamp(props.createTime)}
      />
      <KVTextContainer name="备注" value={props.remark || '无'} />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  drawer: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: global.styles.$spacing_col_base,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: global.styles.$font_size_base,
    color: global.colors.textColor,
    fontWeight: 'bold',
  },
  checkLink: {
    color: global.colors.primaryColor,
  },
})

export default OrderDetailDrawer
