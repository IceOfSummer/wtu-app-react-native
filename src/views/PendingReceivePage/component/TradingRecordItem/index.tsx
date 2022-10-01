import React from 'react'
import { TradingInfo } from '../../../../api/server/trade'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../../utils/DateUtils'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationGeneric, USER_INFO_PAGE } from '../../../../router'

const TradingRecordItem: React.FC<TradingInfo> = props => {
  const nav = useNavigation<UseNavigationGeneric>()
  const seeSeller = () => {
    nav.navigate(USER_INFO_PAGE, {
      id: props.ownerId,
    })
  }

  const cancelOrder = () => {
    // TODO: 取消订单
  }

  return (
    <View style={styles.container}>
      <FastImage style={styles.image} source={{ uri: props.previewImage }} />
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={styles.rightTextContainer}>
          <View>
            <Text style={global.styles.blobText}>{props.name}</Text>
            <KVTextContainer
              icon="&#xe662;"
              name="锁定时间"
              style={styles.text}
              value={formatTimestamp(props.createTime)}
            />
            <KVTextContainer
              icon="&#xe786;"
              name="交易地点"
              style={styles.text}
              value={props.tradeLocation}
            />
          </View>
          <View>
            <Text style={global.styles.errorTipText}>{props.price}￥</Text>
          </View>
        </View>
        <View style={[styles.text, styles.buttonLinkContainer]}>
          <Pressable onPress={seeSeller}>
            <Text style={styles.sellerInfoText}>卖家信息</Text>
          </Pressable>
          <Pressable onPress={cancelOrder}>
            <Text style={styles.cancelText}>不想要了</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
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
  },
  cancelText: {
    marginLeft: 15,
    color: 'red',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
})
export default TradingRecordItem
