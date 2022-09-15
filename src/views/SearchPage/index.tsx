import React, { useEffect, useRef } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import {
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

/**
 * 搜索页面
 */
const SearchPage: React.FC = () => {
  const router = useRoute<UseRouteGeneric<typeof SEARCH_PAGE>>()
  const nav = useNavigation<UseNavigationGeneric>()
  const store = useStore<ReducerTypes>()
  // 手动更新页面，自动更新页面视觉体验上效果较差
  const forceUpdate = useForceUpdate()
  const { searchHistory } = store.getState().commonPersist
  const onSearch = (text: string) => {
    let i = 0
    const len = searchHistory.length
    for (; i < len; i++) {
      if (searchHistory[i] === text) {
        break
      }
    }
    if (i === len) {
      store.dispatch(addSearchHistory(text))
    } else {
      // 已经存在, 调整顺序
      store.dispatch(swapHistoryToFirst(i))
    }
    nav.dispatch(StackActions.replace(COMMODITY_LIST_PAGE, { search: text }))
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
      <View style={global.styles.flexRowJustBetween}>
        <Pressable onPress={nav.goBack}>
          <Icons iconText="&#xe61d;" size={28} />
        </Pressable>
        <RoundSearchBar
          outerStyle={{ flex: 1 }}
          placeHolder={router.params.placeholder}
          // @ts-ignore  ignore ref property
          textInputProps={{ autoFocus: true, ref: textInput }}
          onSubmit={onSearch}
        />
      </View>
      <View>
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
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer: {
    marginVertical: 5,
    paddingHorizontal: 10,
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
})
export default SearchPage
