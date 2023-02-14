import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { useNavigation } from '@react-navigation/native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import {
  CHAT_PAGE,
  FULL_SCREEN_IMAGE_PAGE,
  RouterTypes,
  USER_INFO_PAGE,
} from '../../../../../../router'
import { ProcessedCommodity } from '../../../../../../api/server/commodity'
import NativeDialog from '../../../../../../native/modules/NativeDialog'
import BetterImage from '../../../../../../component/Container/BetterImage'
import KVTextContainer from '../../../../../../component/Container/KVTextContainer'
import { formatTimestamp } from '../../../../../../utils/DateUtils'
import Icons from '../../../../../../component/Icons'
import ColorfulButton from '../../../../../../component/Button/ColorfulButton'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { CommodityPageRouteTypes, FORM_DRAWER_PAGE } from '../../../../index'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../../../redux/counter'
import Toast from 'react-native-root-toast'
import RichTextPresentView from '../../../../../../component/Container/RichTextPresentView'

interface CommodityInfoProps {
  commodity: ProcessedCommodity
}

const CommodityInfo: React.FC<CommodityInfoProps> = props => {
  const { commodity } = props
  const height = Dimensions.get('screen').height
  const nav =
    useNavigation<NavigationProp<RouterTypes & CommodityPageRouteTypes>>()
  const authenticated = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
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
    } else {
      return '已下架'
    }
  }

  const getStatusColor = (): string => {
    if (commodity.status === 0) {
      return global.styles.$primary_color
    } else {
      return 'red'
    }
  }

  const navToSellerInfo = () => {
    nav.navigate(USER_INFO_PAGE, { id: commodity.ownerId })
  }

  const doLockCommodity = () => {
    if (!authenticated) {
      Toast.show('请先登录')
      return
    }
    if (commodity.status === 0) {
      nav.navigate(FORM_DRAWER_PAGE, { commodity })
    } else {
      NativeDialog.showDialog({
        title: '锁定失败',
        message: '商品正在和他人交易或者已经交易完成',
        hideCancelBtn: true,
      })
    }
  }

  const chatWithSeller = () => {
    if (!authenticated) {
      Toast.show('请先登录')
      return
    }
    nav.navigate(CHAT_PAGE, { uid: commodity.ownerId })
  }

  return (
    <View style={{ height: '100%' }}>
      <SpringScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={{ height: height / 2 }}>
          <Swiper style={styles.swiper} loop={false}>
            {commodity.images.map((uri, index) => (
              <Pressable key={index} onPress={() => viewImage(index)}>
                <BetterImage uri={uri} imageProp={{ style: styles.image }} />
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
              icon="&#xe6e1;"
              name="可用数量"
              style={{ marginVertical: 3 }}
              value={commodity.count}
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
          <RichTextPresentView content={commodity.description} />
        </View>
        <View style={{ padding: 50 }} />
      </SpringScrollView>
      <Pressable
        style={styles.backButtonContainer}
        onPress={() => nav.goBack()}>
        <Icons iconText="&#xe61d;" color="#000" />
      </Pressable>
      <View style={styles.toolBar}>
        <View style={styles.toolBarLeftContainer}>
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
  swiper: {},
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
    top: 30,
    left: 10,
    padding: 4,
    backgroundColor: '#00000020',
    overflow: 'hidden',
    borderRadius: 100,
  },
})
export default CommodityInfo
