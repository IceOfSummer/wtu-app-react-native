import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import {
  ACQUISITION_PAGE,
  COMMODITY_LIST_PAGE,
  SEARCH_PAGE,
  UseNavigationGeneric,
  UseRouteGeneric,
} from '../../router'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import {
  addSearchHistory,
  clearSearchHistory,
  swapHistoryToFirst,
} from '../../redux/counter/commonPersistenceSlice'
import NativeDialog from '../../native/modules/NativeDialog'
import useForceUpdate from '../../hook/useForceUpdate'
import Icons from '../../component/Icons'
import CustomStatusBar from '../../component/Container/CustomStatusBar'
import ConditionHideContainer, {
  Else,
  If,
} from '../../component/Container/ConditionHideContainer'
import { SEARCH_LIST_PAGE } from '../AcquisitionPage'

/**
 * 搜索页面
 */
const SearchPage: React.FC = () => {
  const router = useRoute<UseRouteGeneric<typeof SEARCH_PAGE>>()
  const nav = useNavigation<UseNavigationGeneric>()
  const store = useStore<ReducerTypes>()
  const [text, setText] = useState('')
  // 手动更新页面，自动更新页面视觉体验上效果较差
  const forceUpdate = useForceUpdate()
  const { searchHistory } = store.getState().commonPersist
  const onSearch = (
    content: string,
    route:
      | typeof COMMODITY_LIST_PAGE
      | typeof SEARCH_LIST_PAGE = COMMODITY_LIST_PAGE
  ) => {
    if (route === COMMODITY_LIST_PAGE) {
      let i = 0
      const len = searchHistory.length
      for (; i < len; i++) {
        if (searchHistory[i] === content) {
          break
        }
      }
      if (i === len) {
        store.dispatch(addSearchHistory(content))
      } else {
        // 已经存在, 调整顺序
        store.dispatch(swapHistoryToFirst(i))
      }
      nav.dispatch(StackActions.replace(route, { search: content }))
    } else {
      nav.dispatch(
        StackActions.replace(ACQUISITION_PAGE, {
          screen: route,
          params: { title: text },
        })
      )
    }
  }
  const textInput = useRef<TextInput>(null)

  useEffect(() => {
    const listener = nav.addListener('focus', e => {
      if (e.target && e.target.startsWith(SEARCH_PAGE)) {
        textInput.current?.clear()
        textInput.current?.focus()
      }
    })
    return () => {
      nav.removeListener('focus', listener)
    }
  }, [])

  const clearBtnClick = () => {
    NativeDialog.showDialog({
      title: '清空搜索历史',
      message: '确认要清除吗?',
      onConfirm: () => {
        store.dispatch(clearSearchHistory())
        forceUpdate()
      },
    })
  }

  return (
    <View style={styles.headerContainer}>
      <CustomStatusBar />
      <View style={global.styles.flexRowJustBetween}>
        <Pressable onPress={nav.goBack}>
          <Icons iconText="&#xe61d;" size={28} />
        </Pressable>
        <RoundSearchBar
          onChangeText={setText}
          outerStyle={{ flex: 1 }}
          placeHolder={router.params.placeholder}
          inputRef={textInput}
          textInputProps={{ autoFocus: true }}
        />
      </View>
      <ConditionHideContainer>
        <If visible={text.length === 0}>
          <View style={styles.searchHistoryHeader}>
            <View>
              <Text style={global.styles.blobText}>搜索历史</Text>
            </View>
            <Pressable onPress={clearBtnClick}>
              <Text style={global.styles.errorTipText}>清空</Text>
            </Pressable>
          </View>
          <View style={styles.searchHistoryContainer}>
            {searchHistory.map((value, index) => (
              <Pressable
                key={index}
                style={styles.searchHistoryItem}
                onPress={() => onSearch(value)}>
                <Text>{value}</Text>
              </Pressable>
            ))}
          </View>
        </If>
        <Else style={styles.menuContainer}>
          <Pressable
            onPress={() => onSearch(text)}
            style={[
              styles.searchMenu,
              { borderBottomWidth: StyleSheet.hairlineWidth },
            ]}>
            <Icons
              iconText="&#xe6cd;"
              size={20}
              color={global.colors.textColor}
            />
            <Text numberOfLines={1} style={styles.tipText}>
              搜索正在出售的<Text style={styles.searchText}>{text}</Text>
            </Text>
          </Pressable>
          <Pressable
            style={styles.searchMenu}
            onPress={() => onSearch(text, SEARCH_LIST_PAGE)}>
            <Icons
              iconText="&#xe6cc;"
              size={20}
              color={global.colors.textColor}
            />
            <Text numberOfLines={1} style={styles.tipText}>
              搜索正在收购的<Text style={styles.searchText}>{text}</Text>
            </Text>
          </Pressable>
        </Else>
      </ConditionHideContainer>
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer: {
    marginVertical: 5,
  },
  searchHistoryHeader: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  searchHistoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  searchHistoryItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    margin: 5,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: global.styles.$font_size_sm,
  },
  searchMenu: {
    borderColor: global.colors.borderColor,
    paddingVertical: 12,
    backgroundColor: global.colors.boxBackgroundColor,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    marginTop: 10,
  },
  tipText: {
    color: global.colors.textColor,
  },
  searchText: {
    color: global.colors.primaryColor,
  },
})
export default SearchPage
