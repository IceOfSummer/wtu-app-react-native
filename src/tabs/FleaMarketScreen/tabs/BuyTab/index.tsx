import React, { useEffect, useRef, useState } from 'react'
import ShopItem from '../../components/ShopItem'
import { StyleSheet, Text, View } from 'react-native'
import NativeDialog from '../../../../native/modules/NativeDialog'
import {
  getSuggestCommodity,
  ProcessedCommodity,
} from '../../../../api/server/commodity'
import { getLogger } from '../../../../utils/LoggerUtils'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import {
  GOODS_SUBMIT_PAGE,
  RouterTypes,
  SERVER_AUTH_PAGE,
  SETTINGS_PAGE,
} from '../../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import Toast from 'react-native-root-toast'
import HighPerformanceScrollView from '../../../../component/LoadingScrollView/HighPerformanceScrollView'
import CenterBanner from '../../components/CenterBanner'
import { USER_SETTINGS_PAGE } from '../../../../views/SettingsPage'

const logger = getLogger('/tabs/FleaMarketScreen/tabs/MainTab')

const SIZE = 8
/**
 * 跳蚤市场
 */
const BuyTab: React.FC = () => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  const store = useStore<ReducerTypes>()

  const goSubmitItem = () => {
    const userInfo = store.getState().serverUser.userInfo
    if (!userInfo) {
      NativeDialog.showDialog({
        title: '请先登录',
        message: '是否跳转到登录页面',
        onConfirm() {
          nav.navigate(SERVER_AUTH_PAGE)
        },
      })
      return
    }
    if (!userInfo.email) {
      NativeDialog.showDialog({
        title: '您必须绑定邮箱后才能上传商品',
        message: '在商品被购买后，我们将通过邮件通知您，所以请务必绑定邮箱！',
        confirmBtnText: '绑定邮箱',
        onConfirm() {
          nav.navigate(SETTINGS_PAGE, { screen: USER_SETTINGS_PAGE })
        },
      })
      return
    }
    const uid = userInfo.uid
    if (uid) {
      nav.navigate(GOODS_SUBMIT_PAGE, { uid })
    } else {
    }
  }

  // 推荐数据
  const [commodityItems, setCommodityItems] = useState<ProcessedCommodity[]>([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const scroll = useRef<HighPerformanceScrollView<ProcessedCommodity>>(null)
  const maxId = useRef<number | undefined>(undefined)
  const loadMore = (refresh?: boolean) => {
    if (loading) {
      if (refresh) {
        scroll.current?.endRefresh()
      }
      return
    }
    let mxId
    if (refresh) {
      setCommodityItems([])
      mxId = undefined
    } else {
      mxId = maxId.current
    }
    logger.info('loading suggest from id ' + mxId)
    setLoading(true)
    getSuggestCommodity(SIZE, mxId)
      .then(r => {
        setLoadError(false)
        if (r.data.length < SIZE) {
          setEmpty(true)
          logger.info('no more data available! set status to empty')
        }
        if (r.data.length === 0) {
          return
        }
        const lastId = r.data[r.data.length - 1].commodityId
        logger.info('load success, lastId: ' + lastId)
        if (lastId === 1) {
          setEmpty(true)
        }
        maxId.current = lastId - 1
        if (refresh) {
          Toast.show('刷新成功!')
          setCommodityItems(r.data)
        } else {
          setCommodityItems(commodityItems.concat(r.data))
        }
      })
      .catch(e => {
        Toast.show('加载失败: ' + e.message)
        logger.error('load failed: ' + e.message)
        setLoadError(true)
      })
      .finally(() => {
        setLoading(false)
        if (refresh) {
          scroll.current?.endRefresh()
        }
      })
  }

  const onRefresh = () => {
    maxId.current = undefined
    setEmpty(false)
    loadMore(true)
  }

  useEffect(() => {
    loadMore()
  }, [])

  return (
    <HighPerformanceScrollView
      ref={scroll}
      error={loadError}
      keyExtractor={value => value.commodityId.toString()}
      renderItem={({ item }) => <ShopItem commodity={item} />}
      numColumns={2}
      data={commodityItems}
      loading={loading}
      onLoadMore={loadMore}
      onRefresh={onRefresh}
      allLoaded={empty}
      ListHeaderComponent={() => (
        <View>
          <CenterBanner onGoButtonPress={goSubmitItem} />
          <View style={global.styles.baseContainer}>
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceText}>今日推荐</Text>
            </View>
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 10,
  },
  titleText: {
    fontFamily: 'flea-market-title',
    textAlign: 'center',
    fontSize: 36,
    color: global.styles.$text_color,
  },

  headerText: {
    color: global.styles.$text_color,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTextItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 6,
  },
  headerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: 300,
  },
  itemMenuOuterContainer: {
    paddingHorizontal: 10,
    marginVertical: global.styles.$spacing_col_sm,
  },
  itemMenuContainer: {
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logoCard: {
    padding: 2,
    borderRadius: 4,
    marginRight: 5,
  },
  adviceContainer: {
    marginVertical: 10,
    paddingBottom: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: global.styles.$border_color,
  },
  adviceText: {
    color: global.styles.$text_color,
    fontSize: global.styles.$font_size_base,
  },
  shopItemContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  functionalContainer: {
    backgroundColor: global.styles.$bg_color,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
})
export default BuyTab
