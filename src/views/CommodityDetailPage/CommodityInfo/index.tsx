import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ProcessedCommodity } from '../../../api/server/commodity'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'
import { FULL_SCREEN_IMAGE_PAGE, UseNavigationGeneric } from '../../../router'
import FastImage from 'react-native-fast-image'

interface CommodityInfoProps {
  commodity: ProcessedCommodity
}

const CommodityInfo: React.FC<CommodityInfoProps> = props => {
  const nav = useNavigation<UseNavigationGeneric>()
  const viewImage = (index: number) => {
    const images = props.commodity.images.map(value => ({ url: value }))
    nav.navigate(FULL_SCREEN_IMAGE_PAGE, {
      images,
      index,
    })
  }

  return (
    <View style={styles.container}>
      <View style={{ height: '50%' }}>
        <Swiper style={styles.swiper} loop={false}>
          {props.commodity.images.map((uri, index) => (
            <Pressable key={index} onPress={() => viewImage(index)}>
              <FastImage source={{ uri }} style={styles.image} />
            </Pressable>
          ))}
        </Swiper>
      </View>
      <Text>??</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
  },
  container: {
    height: '100%',
  },
  swiper: {
    borderWidth: 1,
  },
})
export default CommodityInfo
