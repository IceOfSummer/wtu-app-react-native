import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
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

/**
 * 商品搜索结果展示页面
 */
const CommodityListPage: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const route = useRoute<UseRouteGeneric<typeof COMMODITY_LIST_PAGE>>()
  const { search } = route.params
  const currentPage = useRef(0)
  const [commodities, setCommodities] = useState<EsCommodity[]>([])

  const loadMore = () => {
    searchCommodity(route.params.search, currentPage.current)
      .then(resp => {
        console.log(resp)
        // setCommodities(commodities.concat(resp.data))
        // currentPage.current++
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    loadMore()
  }, [])

  return (
    <View>
      <View style={styles.headerContainer}>
        <Pressable onPress={nav.goBack}>
          <Icons iconText="&#xe61d;" size={28} />
        </Pressable>
        <RoundSearchBar
          disable
          outerStyle={{ flex: 1 }}
          onContainerPress={() =>
            nav.navigate(SEARCH_PAGE, { placeholder: '' })
          }
          placeHolder={search}
        />
      </View>
      <View>
        <EnhancedScrollView>
          {commodities.map(value => (
            <HorShopItem {...value} key={value.id} />
          ))}
        </EnhancedScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
export default CommodityListPage
