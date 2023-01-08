import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { OrderRouteParam } from '../../index'
import EnhancedLoadingView from '../../../../component/Loading/EnhancedLoadingView'
import {
  OrderDetail,
  orderStatusToString,
  OrderType,
  queryOrderDetail,
} from '../../../../api/server/order'
import { formatTimestamp } from '../../../../utils/DateUtils'
import {
  COMMODITY_PAGE,
  UseNavigationGeneric,
  USER_INFO_PAGE,
} from '../../../../router'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'

const OrderDetailPage: React.FC = () => {
  const route = useRoute<RouteProp<OrderRouteParam, '/OrderPage/OrderDetail'>>()

  const [data, setData] = useState<OrderDetail | undefined>()
  const loadData = () => queryOrderDetail(route.params.oid)
  return (
    <EnhancedLoadingView loadData={loadData} setData={setData}>
      {data ? (
        <Detail order={data} orderId={route.params.oid} />
      ) : (
        <Text style={global.styles.errorTipText}>订单不存在</Text>
      )}
    </EnhancedLoadingView>
  )
}

interface DetailProps {
  orderId: number
  order: OrderDetail
}
const Detail: React.FC<DetailProps> = props => {
  const { order } = props
  const typeWord = OrderType.BUY ? '买' : '卖'
  const nav = useNavigation<UseNavigationGeneric>()
  const statusString = orderStatusToString(order.status)

  const toUserInfo = () => {
    nav.navigate(USER_INFO_PAGE, { id: order.tradeUid })
  }

  const toCommodity = () => {
    nav.navigate(COMMODITY_PAGE, { id: order.commodityId })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={global.styles.flexRowJustBetween}>
        <KVText keyText="订单号" valueText={props.orderId} />
        <Text style={{ color: statusString.color }}>{statusString.name}</Text>
      </View>
      <KVText keyText="商品号" valueText={order.commodityId} />
      <KVText
        keyText="商品名称"
        valueText={order.commodityName}
        onValuePress={toCommodity}
      />
      <KVText keyText="单价" valueText={order.price} />
      <KVText keyText="数量" valueText={order.count} />
      <KVText
        keyText="创建时间"
        valueText={formatTimestamp(order.createTime)}
      />
      <KVText keyText="交易地点" valueText={order.tradeLocation} />
      <KVText keyText="交易类型" valueText={typeWord} />
      <KVText
        keyText={typeWord + '家名称'}
        valueText={order.tradeName}
        onValuePress={toUserInfo}
      />
      <View style={styles.splitLine} />
      <View>
        <Text style={styles.keyText}>交易时备注：</Text>
        <Text style={{ marginVertical: 5 }}>{order.remark || '无'}</Text>
      </View>
      <View style={styles.splitLine} />
      <ConditionHideContainer hide={!order.finishedTime}>
        <KVText
          keyText="完成时间"
          valueText={formatTimestamp(order.finishedTime)}
        />
      </ConditionHideContainer>
      <ConditionHideContainer hide={!order.buyerRemark}>
        <View>
          <Text style={styles.keyText}>买家备注：</Text>
          <Text style={{ marginVertical: 5 }}>{order.buyerRemark || '无'}</Text>
        </View>
      </ConditionHideContainer>
      <ConditionHideContainer hide={!order.sellerRemark}>
        <View>
          <Text style={styles.keyText}>卖家备注：</Text>
          <Text style={{ marginVertical: 5 }}>
            {order.sellerRemark || '无'}
          </Text>
        </View>
      </ConditionHideContainer>
      <View style={styles.splitLine} />
      <Text style={styles.sumPriceText}>
        <Text>合计：</Text>
        {order.count * order.price}￥
      </Text>
    </ScrollView>
  )
}

interface KVTextProps {
  keyText: Displayable
  valueText: Displayable
  onValuePress?: () => void
}
const KVText: React.FC<KVTextProps> = props => {
  return (
    <View style={styles.kvTextContainer}>
      <Text style={styles.keyText}>{props.keyText}：</Text>
      <Text
        onPress={props.onValuePress}
        style={[
          styles.valueText,
          { textDecorationLine: props.onValuePress ? 'underline' : undefined },
        ]}>
        {props.valueText}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    backgroundColor: global.colors.boxBackgroundColor,
    padding: 10,
  },
  keyText: {
    fontWeight: 'bold',
    color: global.colors.textColor,
  },
  valueText: {
    color: global.colors.textColor,
  },
  kvTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  splitLine: {
    borderBottomWidth: 1,
    borderColor: global.colors.borderColor,
    marginVertical: 6,
  },
  sumPriceText: {
    textAlign: 'right',
    color: global.colors.error_color,
    fontSize: global.styles.$font_size_base,
  },
})
export default OrderDetailPage
