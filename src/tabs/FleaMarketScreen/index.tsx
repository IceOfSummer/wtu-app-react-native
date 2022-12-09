import React, { useState } from 'react'
import MainTab from './tabs/MainTab'
import { StyleSheet, View } from 'react-native'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { SEARCH_PAGE, UseNavigationGeneric } from '../../router'
import { useNavigation } from '@react-navigation/native'
import Icons from '../../component/Icons'
import useAutoColorStatusBar from '../../hook/useAutoColorStatusBar'

/**
 * 跳蚤市场
 */
const FleaMarketScreen: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const [searchBarPlaceholder] = useState('搜索您喜欢的商品')
  // 是否显示消息的红点
  const [showMessageRedPoint] = useState(true)
  useAutoColorStatusBar(false, global.colors.statusBarColor)
  /**
   * 当点击搜索框后，跳转到专门的搜索页面
   */
  const onSearchBarPress = () => {
    nav.navigate(SEARCH_PAGE, {})
  }
  return (
    <View style={{ flex: 1 }}>
      <View>
        <View
          style={[global.styles.flexRowJustBetween, styles.headerContainer]}>
          <RoundSearchBar
            outerStyle={{ flex: 1 }}
            containerStyle={styles.searchBarStyle}
            placeHolder={searchBarPlaceholder}
            onContainerPress={onSearchBarPress}
            disable
          />
          <MessageBoxIcon showRedPoint={showMessageRedPoint} />
        </View>
      </View>
      <MainTab />
    </View>
  )
}

interface MessageBoxIconProps {
  showRedPoint?: boolean
}

/**
 * 右上角的消息图标
 */
const MessageBoxIcon: React.FC<MessageBoxIconProps> = props => {
  return (
    <View style={{ position: 'relative' }}>
      <Icons iconText="&#xe8bd;" size={28} />
      <View
        style={[
          styles.redPoint,
          { display: props.showRedPoint ? 'flex' : 'none' },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 8,
    marginVertical: 5,
  },
  searchBarStyle: {
    opacity: 0.9,
  },
  redPoint: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    top: 0,
  },
})

export default FleaMarketScreen
