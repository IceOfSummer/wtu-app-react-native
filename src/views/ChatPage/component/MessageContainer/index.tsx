import React from 'react'
import { ChatMessage, MessageType } from '../../../../sqlite/message'
import { StyleSheet, Text, View } from 'react-native'
import Avatar, { getAvatarUrl } from '../../../../component/Container/Avatar'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'

interface MessageContainerProps {
  chatMessage?: ChatMessage
  hideContainer?: boolean
}

/**
 * 消息容器，该容器将渲染`props.children`中的内容
 * @param props
 * @constructor
 */
const MessageContainer: React.FC<MessageContainerProps> = props => {
  if (props.hideContainer || !props.chatMessage) {
    return (
      <View style={{ marginVertical: global.styles.$spacing_col_sm }}>
        {props.children}
      </View>
    )
  }
  return <Container {...props.chatMessage} children={props.children} />
}

const Container: React.FC<ChatMessage> = props => {
  const state = useStore<ReducerTypes>().getState()
  const userInfo = state.serverUser.userInfo!
  // 用户昵称
  let nickname: string
  if (props.type === MessageType.SEND) {
    nickname = userInfo.nickname
  } else if (state.serverUser.cachedUser[props.username]) {
    nickname = state.serverUser.cachedUser[props.username].nickname
  } else {
    // TODO 用户信息缺省时发送请求获取
    nickname = 'NAME'
  }

  // 要显示的头像uid
  let uid
  if (props.type === MessageType.SEND) {
    uid = userInfo.uid
  } else {
    uid = props.username
  }
  return (
    <View
      style={{
        flexDirection: props.type === MessageType.SEND ? 'row-reverse' : 'row',
        marginVertical: global.styles.$spacing_col_sm,
      }}>
      <View style={styles.avatarContainer}>
        <Avatar uri={getAvatarUrl(uid)} />
      </View>
      <View
        style={{
          alignItems:
            props.type === MessageType.SEND ? 'flex-end' : 'flex-start',
        }}>
        <View>
          <Text style={styles.nameText}>{nickname}</Text>
        </View>
        <View>{props.children}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    marginHorizontal: global.styles.$spacing_col_base,
  },
  nameText: {
    fontSize: global.styles.$font_size_sm,
  },
})

export default MessageContainer
