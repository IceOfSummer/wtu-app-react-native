import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export interface ShowItemProps {
  id: number
  previewImage: any
  name: string
  price: number | string
  width: number
}

/**
 * 商品展示组件
 */
const ShopItem: React.FC<ShowItemProps> = props => {
  return (
    <View style={[styles.container, { width: props.width }]}>
      <Image
        source={props.previewImage}
        style={[
          styles.image,
          { resizeMode: 'stretch', width: props.width, height: props.width },
        ]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText} numberOfLines={2} ellipsizeMode="tail">
          {props.name}
        </Text>
        <Text style={styles.priceText}>￥{props.price}</Text>
      </View>
    </View>
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
