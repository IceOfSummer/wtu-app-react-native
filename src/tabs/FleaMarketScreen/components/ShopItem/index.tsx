import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { ProcessedCommodity } from '../../../../api/server/commodity'
import BetterImage from '../../../../component/Container/BetterImage'
import useNav from '../../../../hook/useNav'
import { COMMODITY_PAGE } from '../../../../router'

export interface ShowItemProps {
  commodity: ProcessedCommodity
}

const PADDING = 4
/**
 * 商品展示组件
 */
const ShopItem: React.FC<ShowItemProps> = props => {
  const { commodity } = props
  const width = useWindowDimensions().width / 2
  const imageWidth = width - PADDING
  const nav = useNav()
  const goItem = () => {
    nav.push(COMMODITY_PAGE, { id: commodity.commodityId })
  }
  return (
    <View style={{ width, paddingHorizontal: 4 }}>
      <Pressable style={[styles.container]} onPress={goItem}>
        <View style={[styles.image, { width: imageWidth, height: imageWidth }]}>
          <BetterImage uri={commodity.previewImage} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.nameText} numberOfLines={2} ellipsizeMode="tail">
            {commodity.name}
          </Text>
          <Text style={styles.priceText}>￥{commodity.price}</Text>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    paddingBottom: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  nameText: {
    color: global.styles.$text_color,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  priceText: {
    color: 'red',
  },
  textContainer: {
    paddingHorizontal: 6,
  },
})

export default ShopItem
