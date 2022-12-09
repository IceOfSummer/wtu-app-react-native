import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ProcessedCommodity } from '../../../../api/server/commodity'
import BetterImage from '../../../../component/Container/BetterImage'
import useNav from '../../../../hook/useNav'
import { COMMODITY_PAGE } from '../../../../router'

export interface ShowItemProps {
  width: number
  commodity: ProcessedCommodity
}

/**
 * 商品展示组件
 */
const ShopItem: React.FC<ShowItemProps> = props => {
  const { commodity } = props
  const nav = useNav()
  const goItem = () => {
    nav.push(COMMODITY_PAGE, { id: commodity.commodityId })
  }
  return (
    <Pressable
      style={[styles.container, { width: props.width }]}
      onPress={goItem}>
      <View style={[styles.image, { width: props.width, height: props.width }]}>
        <BetterImage uri={commodity.previewImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nameText} numberOfLines={2} ellipsizeMode="tail">
          {commodity.name}
        </Text>
        <Text style={styles.priceText}>￥{commodity.price}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginVertical: 5,
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  nameText: {
    color: global.styles.$text_color,
  },
  priceText: {
    color: 'red',
  },
  textContainer: {
    paddingHorizontal: 6,
  },
})

export default ShopItem
