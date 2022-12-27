import React, { useEffect } from 'react'
import Square from './route/Square'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Avatar from '../../component/Container/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { ServerUserInfo } from '../../redux/types/serverUserTypes'
import RoundSearchBar from '../../component/SearchBar/RoundSearchBar'
import { useNavigation } from '@react-navigation/native'
import {
  MESSAGE_TIP_CHECK_PAGE,
  PERSONAL_CENTER_TABS,
  SEARCH_PAGE,
  UseNavigationGeneric,
} from '../../router'
import CustomStatusBar from '../../component/Container/CustomStatusBar'
import Icons from '../../component/Icons'
import { queryMessageTip } from '../../api/server/community'
import { saveMessageTip } from '../../redux/counter/temporaryDataSlice'
import AppEvents from '../../AppEvents'

// 原本打算做个侧拉Drawer的，结果好像有点难实现? 主要是不好把下面的Tabs顶走
const HomeScreen: React.FC = () => {
  const nav = useNavigation<UseNavigationGeneric>()
  const dispatch = useDispatch()
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )
  const authenticated = useSelector<ReducerTypes, boolean>(
    state => state.serverUser.authenticated
  )
  const replyCount = useSelector<ReducerTypes, number>(
    state => state.temporary.messageTipCount
  )

  const goSearch = () => {
    // 这里直接去商品的搜索, 以后再填坑
    nav.navigate(SEARCH_PAGE, { placeholder: '' })
  }

  const toPersonalCenter = () => {
    nav.navigate(PERSONAL_CENTER_TABS)
  }

  const loadMessageTip = () => {
    if (!authenticated) {
      return
    }
    queryMessageTip().then(r => {
      dispatch(saveMessageTip(r.data))
    })
  }

  const onMessageBoxPress = () => {
    nav.navigate(MESSAGE_TIP_CHECK_PAGE)
  }

  useEffect(() => {
    loadMessageTip()
  }, [authenticated])

  useEffect(() => {
    if (userInfo) {
      AppEvents.trigger('onUserChange', userInfo)
    }
  }, [userInfo])

  return (
    <View style={{ flex: 1 }}>
      <CustomStatusBar backgroundColor={global.colors.boxBackgroundColor} />
      <View style={styles.header}>
        <Avatar onPress={toPersonalCenter} uid={userInfo?.uid} size={45} />
        <RoundSearchBar
          onContainerPress={goSearch}
          containerStyle={styles.searchBar}
          placeHolder="搜索"
          disable
          outerStyle={{ flex: 1 }}
        />
        {authenticated ? (
          <MessageBoxIcon
            newTipCount={replyCount}
            onPress={onMessageBoxPress}
          />
        ) : null}
      </View>
      <View style={{ zIndex: 1, flex: 1 }}>
        <Square />
      </View>
    </View>
  )
}

interface MessageBoxIconProps {
  newTipCount: number
  onPress?: () => void
}

/**
 * 右上角的消息图标
 */
const MessageBoxIcon: React.FC<MessageBoxIconProps> = props => {
  return (
    <Pressable onPress={props.onPress}>
      <Icons iconText="&#xe8bd;" size={34} />
      {props.newTipCount === 0 ? null : (
        <Text style={styles.redPoint}>{props.newTipCount}</Text>
      )}
    </Pressable>
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
  redPoint: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'red',
    position: 'absolute',
    right: -8,
    top: -4,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
  },
  tipCountText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
})

export default HomeScreen
