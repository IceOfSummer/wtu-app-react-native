import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { formatTimestamp } from '../../../../utils/DateUtils'
import Icons from '../../../../component/Icons'
import { EsCommodity } from '../../../../api/server/types'
import BetterImage from '../../../../component/Container/BetterImage'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationGeneric, USER_INFO_PAGE } from '../../../../router'

interface HorShopItemProps {
  onClick?: () => void
}

/**
 * 横着显示的商品
 * @param props
 * @constructor
 */
const HorShopItem: React.FC<EsCommodity & HorShopItemProps> = props => {
  const date = new Date(props.createTime)
  const nav = useNavigation<UseNavigationGeneric>()
  const standerPrice = props.price.toFixed(2)
  const dimensions = useWindowDimensions()
  const len = dimensions.height / 6
  const toSeller = () => {
    nav.navigate(USER_INFO_PAGE, { id: props.sellerId })
  }

  return (
    <View style={styles.outer}>
      <Pressable
        onPress={props.onClick}
        style={[styles.container, { height: len }]}>
        <View style={{ width: len, height: len, padding: 5 }}>
          <BetterImage
            uri={props.image}
            imageProp={{
              style: { flex: 1, borderRadius: 8 },
              resizeMode: 'stretch',
            }}
            width="100%"
            height="100%"
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.commodityTitle} numberOfLines={2}>
            {props.name}
          </Text>
          <KVTextContainer
            name="交易地点"
            value={props.tradeLocation}
            icon="&#xe786;"
          />
          <KVTextContainer
            name="发布时间"
            value={formatTimestamp(date.getTime())}
            icon="&#xe662;"
          />
          <KVTextContainer
            icon="&#xe79b;"
            name="卖家"
            onPress={toSeller}
            valueStyles={{ textDecorationLine: 'underline', flex: 1 }}
            value={props.sellerNickname + '>'}
          />
          <View style={styles.bottomContainer}>
            <View>
              <Text style={styles.priceText}>￥{standerPrice}</Text>
            </View>
            <View>
              <Icons iconText="&#xe636;" />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 10,
  },
  container: {
    overflow: 'hidden',
    flex: 1,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  image: {
    resizeMode: 'stretch',
  },
  descriptionContainer: {
    flex: 2,
    marginLeft: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 18,
    flexWrap: 'wrap',
  },
  normalText: {
    color: '#000',
    fontSize: 12,
  },
  commodityTitle: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
    fontWeight: 'bold',
  },
  priceText: {
    color: 'red',
    fontSize: global.styles.$font_size_base,
  },
})
export default HorShopItem
