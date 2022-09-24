import React, { useRef } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { ProcessedCommodity } from '../../../../api/server/commodity'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'
import {
  FULL_SCREEN_IMAGE_PAGE,
  UseNavigationGeneric,
  USER_INFO_PAGE,
} from '../../../../router'
import FastImage from 'react-native-fast-image'
import Icons from '../../../../component/Icons'
import ColorfulButton from '../../../../component/Button/ColorfulButton'
import { formatTimestamp } from '../../../../utils/DateUtils'
import KVTextContainer from '../../../../component/Container/KVTextContainer'
import NativeDialog from '../../../../native/modules/NativeDialog'
import LockCommodityDrawer, {
  LockCommodityDrawerRefAttribute,
} from '../LockCommodityDrawer'

interface CommodityInfoProps {
  commodity: ProcessedCommodity
}

const CommodityInfo: React.FC<CommodityInfoProps> = props => {
  const { commodity } = props
  const { height } = useWindowDimensions()
  const nav = useNavigation<UseNavigationGeneric>()
  const bottomDrawer = useRef<LockCommodityDrawerRefAttribute>(null)
  const viewImage = (index: number) => {
    const images = props.commodity.images.map(value => ({ url: value }))
    nav.navigate(FULL_SCREEN_IMAGE_PAGE, {
      images,
      index,
    })
  }

  const getStatusText = (): string => {
    if (commodity.status === 0) {
      return '可用'
    } else if (commodity.status === 1) {
      return '交易中'
    } else {
      return '交易已完成'
    }
  }

  const getStatusColor = (): string => {
    if (commodity.status === 0) {
      return global.styles.$primary_color
    } else if (commodity.status === 1) {
      return 'gold'
    } else {
      return 'red'
    }
  }

  const navToSellerInfo = () => {
    nav.navigate(USER_INFO_PAGE, { id: commodity.ownerId })
  }

  const doLockCommodity = () => {
    if (commodity.status === 0) {
      bottomDrawer.current?.open()
    } else {
      NativeDialog.showDialog({
        title: '锁定失败',
        message: '商品正在和他人交易或者已经交易完成',
        hideCancelBtn: true,
      })
    }
  }

  const chatWithSeller = () => {
    // TODO chat with seller
    console.log('chat with seller')
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
            <KVTextContainer
              icon="&#xe786;"
              name="交易地点"
              style={{ marginVertical: 3 }}
              value={commodity.tradeLocation}
            />
            <KVTextContainer
              icon="&#xe662;"
              name="发布时间"
              style={{ marginVertical: 3 }}
              value={formatTimestamp(commodity.createTime)}
            />
            <KVTextContainer
              icon="&#xe601;"
              name="商品状态"
              style={{ marginVertical: 3 }}
              valueColor={getStatusColor()}
              value={getStatusText()}
            />
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
      <Pressable
        style={styles.backButtonContainer}
        onPress={() => nav.goBack()}>
        <Icons iconText="&#xe61d;" color="#000" />
      </Pressable>
      <View style={styles.toolBar}>
        <View style={styles.toolBarLeftContainer}>
          <Pressable style={styles.toolBarIcon} onPress={chatWithSeller}>
            <Icons iconText="&#xe8bd;" size={20} color="#000" />
            <Text style={styles.toolbarText}>联系</Text>
          </Pressable>
          <Pressable onPress={navToSellerInfo} style={styles.toolBarIcon}>
            <Icons iconText="&#xe79b;" size={20} color="#000" />
            <Text style={styles.toolbarText}>卖家</Text>
          </Pressable>
        </View>
        <View style={styles.toolBarButtonContainer}>
          <ColorfulButton
            style={{ marginRight: 6 }}
            containerStyle={styles.buttonStyle}
            color={global.styles.$primary_color}
            title="和卖家联系"
            onPress={chatWithSeller}
          />
          <ColorfulButton
            style={{ marginRight: 6 }}
            containerStyle={styles.buttonStyle}
            color="red"
            title="  锁定商品  "
            onPress={doLockCommodity}
          />
        </View>
      </View>
      <LockCommodityDrawer ref={bottomDrawer} commodity={commodity} />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
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
  backButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 4,
    backgroundColor: '#00000020',
    overflow: 'hidden',
    borderRadius: 100,
  },
})
export default CommodityInfo
