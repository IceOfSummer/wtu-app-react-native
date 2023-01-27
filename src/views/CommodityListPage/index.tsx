import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import {
  COMMODITY_DETAIL_PAGE,
  COMMODITY_LIST_PAGE,
  SEARCH_PAGE,
  UseNavigationGeneric,
  UseRouteGeneric,
} from '../../router'
import Icons from '../../component/Icons'
import { EsCommodity } from '../../api/server/types'
import { searchCommodity } from '../../api/server/commodity'
import HorShopItem from './component/HorShopItem'
import CustomStatusBar from '../../component/Container/CustomStatusBar'
import { LoadingScrollView } from '../../component/LoadingScrollView'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/views/CommodityListPage')

const SIZE = 6

/**
 * 商品搜索结果展示页面
 */
const CommodityListPage: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const route = useRoute<UseRouteGeneric<typeof COMMODITY_LIST_PAGE>>()
  const { search } = route.params
  const currentPage = useRef(0)
  const [commodities, setCommodities] = useState<EsCommodity[]>([])
  const [loadFail, setLoadFail] = useState(false)
  const [empty, setEmpty] = useState(false)
  const scroll = useRef<LoadingScrollView>(null)

  const loadMore = () => {
    searchCommodity(route.params.search, currentPage.current, SIZE)
      .then(resp => {
        if (resp.data.length < SIZE) {
          setEmpty(true)
        }
        setCommodities(commodities.concat(resp.data))
        currentPage.current++
        setLoadFail(false)
      })
      .catch(e => {
        setLoadFail(true)
        logger.error('search commodity failed: ' + e.message)
        Toast.show('加载失败: ' + e.message)
      })
      .finally(() => {
        scroll.current?.endLoading()
      })
  }

  const navToCommodity = (id: number) => {
    nav.navigate(COMMODITY_DETAIL_PAGE, { id })
  }

  useEffect(() => {
    loadMore()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar />
      <View style={styles.headerContainer}>
        <Pressable onPress={nav.goBack}>
          <Icons iconText="&#xe61d;" size={28} />
        </Pressable>
        <RoundSearchBar
          disable
          outerStyle={{ flex: 1 }}
          onContainerPress={() =>
            nav.dispatch(StackActions.replace(SEARCH_PAGE, { placeholder: '' }))
          }
          placeHolder={search}
        />
      </View>
      <LoadingScrollView
        ref={scroll}
        showEmptyTip
        onRequireLoad={loadMore}
        error={loadFail}
        empty={empty}
        dataLength={commodities.length}>
        {commodities.map(value => (
          <HorShopItem
            onClick={() => navToCommodity(value.id)}
            {...value}
            key={value.id}
          />
        ))}
      </LoadingScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 2,
    marginVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
export default CommodityListPage
