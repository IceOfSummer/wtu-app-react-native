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
import EnhancedScrollView from '../../component/EnhancedScrollView'
import { searchCommodity } from '../../api/server/commodity'
import HorShopItem from './component/HorShopItem'
import NativeDialog from '../../native/modules/NativeDialog'
import CommoditySkeleton from './component/CommoditySkeleton'
import CustomStatusBar from '../../component/Container/CustomStatusBar'

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
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)

  const loadMore = () => {
    setLoading(true)
    searchCommodity(route.params.search, currentPage.current)
      .then(resp => {
        if (resp.data.length === 0) {
          setEmpty(true)
          return
        }
        setCommodities(commodities.concat(resp.data))
        currentPage.current++
        setLoadFail(false)
      })
      .catch(e => {
        setLoadFail(true)
        NativeDialog.showDialog({
          title: '请求失败',
          message: e.message,
          hideCancelBtn: true,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const navToCommodity = (id: number) => {
    nav.navigate(COMMODITY_DETAIL_PAGE, { id })
  }

  useEffect(() => {
    loadMore()
  }, [])

  return (
    <View>
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
      <View style={{ zIndex: 1, overflow: 'hidden' }}>
        <EnhancedScrollView
          onRequireLoad={loadMore}
          fail={loadFail}
          loading={loading}
          empty={empty}
          dataLength={commodities.length}
          loadingSkeleton={<LoadingSkeleton />}
          onScrollToBottom={loadMore}
          scrollViewProps={{ scrollEnabled: commodities.length > 0 }}>
          {commodities.map(value => (
            <HorShopItem
              onClick={() => navToCommodity(value.id)}
              {...value}
              key={value.id}
            />
          ))}
        </EnhancedScrollView>
      </View>
    </View>
  )
}
const LoadingSkeleton: React.FC = () => {
  return (
    <View>
      <CommoditySkeleton />
      <CommoditySkeleton />
      <CommoditySkeleton />
      <CommoditySkeleton />
      <CommoditySkeleton />
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
