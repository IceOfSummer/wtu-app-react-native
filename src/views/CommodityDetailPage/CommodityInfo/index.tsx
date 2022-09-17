import React from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { ProcessedCommodity } from '../../../api/server/commodity'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'
import { FULL_SCREEN_IMAGE_PAGE, UseNavigationGeneric } from '../../../router'
import FastImage from 'react-native-fast-image'
import Icons from '../../../component/Icons'
import ColorfulButton from '../../../component/Button/ColorfulButton'

interface CommodityInfoProps {
  commodity: ProcessedCommodity
}

const CommodityInfo: React.FC<CommodityInfoProps> = props => {
  const { commodity } = props
  const { height } = useWindowDimensions()
  const nav = useNavigation<UseNavigationGeneric>()
  const viewImage = (index: number) => {
    const images = props.commodity.images.map(value => ({ url: value }))
    nav.navigate(FULL_SCREEN_IMAGE_PAGE, {
      images,
      index,
    })
  }

  return (
    <View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ height: height / 2 }}>
          <Swiper style={styles.swiper} loop={false}>
            {commodity.images.map((uri, index) => (
              <Pressable key={index} onPress={() => viewImage(index)}>
                <FastImage source={{ uri }} style={styles.image} />
              </Pressable>
            ))}
          </Swiper>
        </View>
        <View style={styles.descriptionContainer}>
          <View>
            <Text style={styles.priceText}>{commodity.price.toFixed(2)}￥</Text>
          </View>
          <View>
            <Text style={styles.titleText}>{commodity.name}</Text>
          </View>
          <View style={styles.commodityInfoContainer}>
            <View style={styles.commodityInfo}>
              <Icons iconText="&#xe79b;" />
              <Text>卖家: </Text>
              <Text
                style={[
                  styles.commodityInfoText,
                  { textDecorationLine: 'underline' },
                ]}>
                查看卖家信息
              </Text>
            </View>
            <View style={styles.commodityInfo}>
              <Icons iconText="&#xe786;" />
              <Text>交易地点: </Text>
              <Text style={styles.commodityInfoText}>
                {commodity.tradeLocation}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <View>
            <Text style={styles.titleText}>商品详细</Text>
          </View>
          <View style={styles.commodityInfoContainer}>
            <Text>{commodity.description}</Text>
          </View>
        </View>
        <View style={{ padding: 50 }} />
      </ScrollView>
      <View style={styles.toolBar}>
        <View style={styles.toolBarLeftContainer}>
          <View style={styles.toolBarIcon}>
            <Icons iconText="&#xe8bd;" size={20} color="#000" />
            <Text style={styles.toolbarText}>联系</Text>
          </View>
          <View style={styles.toolBarIcon}>
            <Icons iconText="&#xe79b;" size={20} color="#000" />
            <Text style={styles.toolbarText}>卖家</Text>
          </View>
        </View>
        <View style={styles.toolBarButtonContainer}>
          <ColorfulButton
            style={{ marginRight: 6 }}
            containerStyle={styles.buttonStyle}
            color={global.styles.$primary_color}
            title="和卖家联系"
          />
          <ColorfulButton
            style={{ marginRight: 6 }}
            containerStyle={styles.buttonStyle}
            color="red"
            title="  锁定商品  "
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
  },
  container: {
    position: 'relative',
  },
  swiper: {
    borderWidth: 1,
  },
  descriptionContainer: {
    marginHorizontal: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  priceText: {
    marginVertical: 4,
    color: 'red',
    fontSize: 22,
  },
  descriptionLine: {
    flexDirection: 'row',
  },
  commodityInfoContainer: {
    marginTop: 15,
  },
  commodityInfo: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commodityInfoText: {
    color: '#000',
  },
  toolBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    paddingHorizontal: 40,
  },
  toolbarText: {
    fontSize: 10,
  },
  toolBarButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toolBarLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  toolBarIcon: {
    // marginHorizontal: 6,
  },
})
export default CommodityInfo
