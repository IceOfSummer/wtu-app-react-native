import React, { useState } from 'react'
import MainTab from './tabs/MainTab'
import { StyleSheet, View } from 'react-native'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { SEARCH_PAGE, UseNavigationGeneric } from '../../router'
import { useNavigation } from '@react-navigation/native'
import CustomStatusBar from '../../component/Container/CustomStatusBar'

/**
 * 跳蚤市场
 */
const FleaMarketScreen: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const [searchBarPlaceholder] = useState('搜索您喜欢的商品')

  /**
   * 当点击搜索框后，跳转到专门的搜索页面
   */
  const onSearchBarPress = () => {
    nav.navigate(SEARCH_PAGE, {})
  }
  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar />
      <View style={[global.styles.flexRowJustBetween, styles.headerContainer]}>
        <RoundSearchBar
          outerStyle={{ flex: 1 }}
          containerStyle={styles.searchBarStyle}
          placeHolder={searchBarPlaceholder}
          onContainerPress={onSearchBarPress}
          disable
        />
      </View>
      <MainTab />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 8,
    marginVertical: 5,
    zIndex: 2,
  },
  searchBarStyle: {
    opacity: 0.9,
  },
})

export default FleaMarketScreen
