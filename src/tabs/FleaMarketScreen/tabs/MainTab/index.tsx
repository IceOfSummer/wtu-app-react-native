import React, { useEffect, useRef, useState } from 'react'
import ShopItem from '../../components/ShopItem'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import NativeDialog from '../../../../native/modules/NativeDialog'
import { LoadingScrollView } from '../../../../component/LoadingScrollView'
import {
  getSuggestCommodity,
  ProcessedCommodity,
} from '../../../../api/server/commodity'
import { getLogger } from '../../../../utils/LoggerUtils'
import CenterBanner from '../../components/CenterBanner'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import {
  GOODS_SUBMIT_PAGE,
  RouterTypes,
  SERVER_AUTH_PAGE,
} from '../../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import Toast from 'react-native-root-toast'
import FleaMarketRefreshHeader from '../../components/FleaMarketRefreshHeader'

const logger = getLogger('/tabs/FleaMarketScreen/tabs/MainTab')

/**
 * 跳蚤市场
 */
const MainTab: React.FC = () => {
  const [itemContainerWidth, setItemContainerWidth] = useState(0)
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  const store = useStore<ReducerTypes>()

  const goSubmitItem = () => {
    const uid = store.getState().serverUser.userInfo?.uid
    if (uid) {
      nav.navigate(GOODS_SUBMIT_PAGE, { uid })
    } else {
      NativeDialog.showDialog({
        title: '请先登录',
        message: '是否跳转到登录页面',
        onConfirm() {
          nav.navigate(SERVER_AUTH_PAGE)
        },
      })
    }
  }
  const onItemContainerLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setItemContainerWidth(nativeEvent.layout.width / 2 - 5)
  }

  // 推荐数据
  const [commodityItems, setCommodityItems] = useState<ProcessedCommodity[]>([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const scroll = useRef<LoadingScrollView>(null)
  const maxId = useRef<number | undefined>(undefined)
  const loadMore = (refresh?: boolean) => {
    logger.info('loading suggest...')
    setLoading(true)
    getSuggestCommodity(maxId.current)
      .then(r => {
        setLoadError(false)
        if (r.data.length === 0) {
          setEmpty(true)
          logger.info('no more data available!')
          return
        }
        const lastId = r.data[r.data.length - 1].commodityId
        logger.debug(r.data)
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
    loadMore(true)
  }

  useEffect(() => {
    loadMore()
  }, [])

  return (
    <LoadingScrollView
      refreshHeader={FleaMarketRefreshHeader}
      ref={scroll}
      dataLength={commodityItems.length}
      loading={loading}
      onRequireLoad={loadMore}
      onRefresh={onRefresh}
      empty={empty}
      error={loadError}>
      <CenterBanner onGoButtonPress={goSubmitItem} />
      <View style={global.styles.baseContainer}>
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceText}>今日推荐</Text>
        </View>
        <View style={styles.shopItemContainer} onLayout={onItemContainerLayout}>
          {commodityItems.map(value => (
            <ShopItem
              commodity={value}
              width={itemContainerWidth}
              key={value.commodityId}
            />
          ))}
        </View>
      </View>
    </LoadingScrollView>
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
export default MainTab
