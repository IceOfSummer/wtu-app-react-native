import React, { useEffect, useState } from 'react'
import { OrderDetail, OrderStatus } from '../../../../api/server/order'
import Drawer from '../../../../component/Drawer'
import { StyleSheet, Text, View } from 'react-native'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../../utils/DateUtils'
import useNav from '../../../../hook/useNav'
import { COMMODITY_PAGE } from '../../../../router'
import { FinishedTrade, getFinishedTrade } from '../../../../api/server/trade'
import ColorfulButton from '../../../../component/Button/ColorfulButton'

interface OrderDetailDrawerProps {
  order?: OrderDetail
  drawerRef: React.RefObject<Drawer>
}

const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = props => {
  const { order } = props

  return (
    <Drawer ref={props.drawerRef} style={styles.drawer}>
      {order ? <Detail {...order} /> : null}
    </Drawer>
  )
}

const Detail: React.FC<OrderDetail> = props => {
  const nav = useNav()
  const [finishedTrade, setFinishedTrade] = useState<FinishedTrade>()
  const checkCommodity = () => {
    if (props.orderId) {
      nav.push(COMMODITY_PAGE, { id: props.orderId })
    }
  }

  useEffect(() => {
    if (props.status !== OrderStatus.TRADING) {
      getFinishedTrade(props.orderId)
        .then(resp => {
          setFinishedTrade(resp.data)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }, [])

  const confirmReceive = () => {
    // todo
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{props.name}</Text>
        <Text style={styles.checkLink} onPress={checkCommodity}>
          查看商品
        </Text>
      </View>
      <KVTextContainer
        name="创建时间"
        value={formatTimestamp(props.createTime)}
      />
      <KVTextContainer name="交易地点" value={props.tradeLocation} />
      <KVTextContainer name="数量" value={props.count} />
      <KVTextContainer name="单价" value={props.price} />
      <KVTextContainer name="备注" value={props.remark || '无'} />
      {props.status !== OrderStatus.TRADING && finishedTrade ? (
        <FinishedTradeShow {...finishedTrade} />
      ) : null}
      {props.status === OrderStatus.TRADING ? (
        <ColorfulButton
          style={{ marginVertical: 15 }}
          color={global.colors.primaryColor}
          title="确认已收货"
          onPress={confirmReceive}
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
      <KVTextContainer name="备注" value={props.remark} />
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
