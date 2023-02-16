import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { SEARCH_PAGE, UseNavigationGeneric } from '../../router'
import { useNavigation } from '@react-navigation/native'
import CustomStatusBar from '../../component/Container/CustomStatusBar'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import SellTab from './tabs/SellTab'
import BuyTab from './tabs/BuyTab'
import {
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/types'

const routes = [
  { key: 'buy', title: '出售' },
  {
    key: 'sell',
    title: '收购',
  },
]

const renderScene = SceneMap({
  buy: BuyTab,
  sell: SellTab,
})

const renderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<any>
  }
) => {
  return (
    <TabBar
      {...props}
      activeColor={global.colors.primaryColor}
      labelStyle={{ color: global.colors.textColor }}
      indicatorStyle={{ backgroundColor: global.colors.primaryColor }}
      style={{ backgroundColor: global.colors.boxBackgroundColor }}
    />
  )
}

/**
 * 跳蚤市场
 */
const FleaMarketScreen: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const [searchBarPlaceholder] = useState('搜索您喜欢的商品')
  const [index, setIndex] = useState(0)

  /**
   * 当点击搜索框后，跳转到专门的搜索页面
   */
  const onSearchBarPress = () => {
    nav.navigate(SEARCH_PAGE, {})
  }
  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar backgroundColor={global.colors.boxBackgroundColor} />
      <View style={[global.styles.flexRowJustBetween, styles.headerContainer]}>
        <RoundSearchBar
          outerStyle={{ flex: 1 }}
          containerStyle={styles.searchBarStyle}
          placeHolder={searchBarPlaceholder}
          onContainerPress={onSearchBarPress}
          disable
        />
      </View>
      <TabView
        onIndexChange={setIndex}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    zIndex: 2,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  searchBarStyle: {
    opacity: 0.9,
    backgroundColor: global.colors.backgroundColor,
  },
})

export default FleaMarketScreen
