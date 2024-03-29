import React, { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { CHAT_PAGE, UseRouteGeneric } from '../../router'
import { useDispatch, useStore } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import { StyleSheet, View } from 'react-native'
import ToolBar from './component/ToolBar'
import MessageArea from './component/MessageArea'
import ConnectFailView from '../../tabs/MessageScreen/components/ConnectFailView'
import { markMessageRead } from '../../redux/counter/messageSlice'

/**
 * 聊天页面
 */
const ChatPage: React.FC = () => {
  const route = useRoute<UseRouteGeneric<typeof CHAT_PAGE>>()
  const nav = useNavigation()
  const store = useStore<ReducerTypes>()
  const dispatch = useDispatch()
  const { uid } = route.params

  useEffect(() => {
    const user = store.getState().serverUser.cachedUser[uid]
    nav.setOptions({
      title: user && user.nickname ? user.nickname : '用户' + uid,
    })
    return () => {
      dispatch(markMessageRead(uid))
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ConnectFailView />
      <MessageArea chatWith={uid} />
      <ToolBar styles={styles.toolbar} talkingTo={uid} />
    </View>
  )
}

const styles = StyleSheet.create({
  toolbar: {},
  messageContainer: {
    flex: 1,
  },
})
export default ChatPage
