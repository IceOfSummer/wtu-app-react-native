import React from 'react'
import Square from './route/Square'
import { StyleSheet, View } from 'react-native'
import Avatar, { getAvatarUrl } from '../../component/Container/Avatar'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { ServerUserInfo } from '../../redux/types/serverUserTypes'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { useNavigation } from '@react-navigation/native'
import {
  PERSONAL_CENTER_TABS,
  SEARCH_PAGE,
  UseNavigationGeneric,
} from '../../router'
import CustomStatusBar from '../../component/Container/CustomStatusBar'

// 原本打算做个侧拉Drawer的，结果好像有点难实现? 主要是不好把下面的Tabs顶走
const HomeScreen: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )

  const goSearch = () => {
    console.log('tap')
    // 这里直接去商品的搜索, 以后再填坑
    nav.navigate(SEARCH_PAGE, { placeholder: '' })
  }

  const toPersonalCenter = () => {
    nav.navigate(PERSONAL_CENTER_TABS)
  }
  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar backgroundColor={global.colors.boxBackgroundColor} />
      <View style={styles.header}>
        <Avatar
          onPress={toPersonalCenter}
          uri={userInfo ? getAvatarUrl(userInfo.uid) : undefined}
          size={45}
        />
        <RoundSearchBar
          onContainerPress={goSearch}
          containerStyle={styles.searchBar}
          placeHolder="搜索"
          disable
          outerStyle={{ flex: 1 }}
        />
      </View>
      <View style={{ zIndex: 1, flex: 1 }}>
        <Square />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    width: '100%',
    backgroundColor: global.colors.boxBackgroundColor,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  searchBar: {
    backgroundColor: global.colors.shallowBoxBackgroundColor,
    width: '100%',
  },
})

export default HomeScreen
