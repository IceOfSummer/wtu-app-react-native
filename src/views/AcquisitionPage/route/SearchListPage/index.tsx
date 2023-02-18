import React, { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import RoundSearchBar from '../../../../component/SearchBar/RoundSearchBar'
import usePage from '../../../../hook/usePage'
import { searchAcquisitionByTitle } from '../../../../api/server/acquisition'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { AcquisitionSubmitPageRoute } from '../../index'
import HighPerformanceScrollView from '../../../../component/LoadingScrollView/HighPerformanceScrollView'
import { AcquisitionItem } from '../../../../tabs/FleaMarketScreen/tabs/SellTab'
import CustomStatusBar from '../../../../component/Container/CustomStatusBar'
import Icons from '../../../../component/Icons'
import { SEARCH_PAGE, UseNavigationGeneric } from '../../../../router'

const SearchListPage: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()

  const toSearch = () => {
    nav.navigate(SEARCH_PAGE, { placeholder: '' })
  }

  const route =
    useRoute<
      RouteProp<AcquisitionSubmitPageRoute, '/acquisitionPage/SearchListPage'>
    >()

  const page = usePage(
    (pg, size) => searchAcquisitionByTitle(route.params.title, pg, size),
    6
  )
  useEffect(() => {
    page.loadMore().catch(() => null)
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar />
      <View style={global.styles.flexRowJustBetween}>
        <Pressable onPress={nav.goBack}>
          <Icons iconText="&#xe61d;" size={28} />
        </Pressable>
        <RoundSearchBar
          placeHolder={route.params.title}
          onContainerPress={toSearch}
          outerStyle={{ flex: 1 }}
          disable
        />
      </View>
      <HighPerformanceScrollView
        {...page}
        contentContainerStyle={{ paddingVertical: 10 }}
        allLoaded={page.empty}
        onEndReachedThreshold={0.1}
        onLoadMore={page.loadMore}
        keyExtractor={value => value.id.toString()}
        renderItem={props => <AcquisitionItem {...props} />}
      />
    </View>
  )
}

export default SearchListPage
