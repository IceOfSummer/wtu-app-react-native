import React, { useState } from 'react'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import MainTab from './tabs/MainTab'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import NewItemTab from './tabs/NewItemTab'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { SEARCH_PAGE, UseNavigationGeneric } from '../../router'
import { useNavigation } from '@react-navigation/native'
import Icons from '../../component/Icons'
import {
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/types'
import useAutoColorStatusBar from '../../hook/useAutoColorStatusBar'

const renderScene = SceneMap({
  main: MainTab,
  newItem: NewItemTab,
  newItem1: NewItemTab,
  newItem2: NewItemTab,
})

const routes = [
  { key: 'main', title: '精选' },
  { key: 'newItem', title: '最新' },
  { key: 'newItem1', title: '跑腿' },
  { key: 'newItem2', title: '拼单' },
]

const renderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<any>
  }
) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: global.styles.$bg_color_grey }}
    style={{
      backgroundColor: global.styles.$bg_color_grey,
      shadowColor: '#00000000',
      marginTop: -5,
    }}
    inactiveColor={global.styles.$text_placeholder}
    activeColor={global.styles.$primary_color}
    contentContainerStyle={{
      shadowOpacity: 0,
    }}
    renderLabel={({ route, focused, color }) => (
      <Text
        style={{
          color,
          fontWeight: focused ? 'bold' : 'normal',
          fontSize: 16,
        }}>
        {route.title}
      </Text>
    )}
    bounces
  />
)
/**
 * 跳蚤市场
 */
const FleaMarketScreen: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const layout = useWindowDimensions()
  const [tabIndex, setTabIndex] = useState(0)
  const [searchBarPlaceholder] = useState('搜索您喜欢的商品')
  // 是否显示消息的红点
  const [showMessageRedPoint] = useState(true)
  useAutoColorStatusBar(false, global.colors.backgroundColor)
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
      <TabView
        onIndexChange={setTabIndex}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
      />
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
