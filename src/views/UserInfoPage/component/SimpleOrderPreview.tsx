import React from 'react'
import { SimpleOrder } from '../../../api/server/order'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import KVTextContainer from '../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../utils/DateUtils'

interface SimpleOrderPreviewProps {
  order: SimpleOrder
}

/**
 * SimpleOrder的展示组件
 */
const SimpleOrderPreview: React.FC<SimpleOrderPreviewProps> = props => {
  const { order } = props
  return (
    <View style={styles.container}>
      <FastImage source={{ uri: order.previewImage }} style={styles.image} />
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
            name="完成时间"
            value={formatTimestamp(order.createTime)}
          />
          <KVTextContainer
            name="交易结果"
            value={order.fail ? '失败' : '成功'}
          />
          <KVTextContainer
            name="用户备注"
            value={order.remark ? order.remark : '无'}
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
