import React from 'react'
import { OrderPreview, orderStatusToString } from '../../../api/server/order'
import { StyleSheet, Text, View } from 'react-native'
import KVTextContainer from '../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../utils/DateUtils'
import BetterImage from '../../../component/Container/BetterImage'

interface SimpleOrderPreviewProps {
  order: OrderPreview
}

/**
 * SimpleOrder的展示组件
 */
const SimpleOrderPreview: React.FC<SimpleOrderPreviewProps> = props => {
  const { order } = props
  const statusString = orderStatusToString(order.status)
  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <BetterImage uri={order.previewImage} />
      </View>
      <View style={styles.infoContainer}>
        <View style={global.styles.flexRowJustBetween}>
          <Text
            style={[global.styles.blobText, styles.titleText]}
            ellipsizeMode="tail"
            numberOfLines={2}>
            {order.name}
          </Text>
          <Text style={global.styles.errorTipText}>{order.price}￥</Text>
        </View>
        <View>
          <KVTextContainer
            name="开始时间"
            value={formatTimestamp(order.createTime)}
          />
          <KVTextContainer
            name="交易结果"
            value={statusString.name}
            valueColor={statusString.color}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginVertical: 8,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    width: '80%',
  },
})

export default SimpleOrderPreview
