import { MessageType, SqliteMessage } from '../../../../sqlite/message'
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import Avatar from '../../../../component/Container/Avatar'

export interface MessageContainerOptionalProps {
  /**
   * 是否隐藏外层头像，若隐藏，消息将居中显示
   */
  hideAvatar?: boolean
}

export interface MessageContainerProps {
  chatMessage?: SqliteMessage
  hideContainer?: boolean
  onLayout?: (event: LayoutChangeEvent) => void
}

/**
 * 消息容器，该容器将渲染`props.children`中的内容
 * @param props
 * @constructor
 */
const MessageContainer: React.FC<MessageContainerProps> = props => {
  if (props.hideContainer || !props.chatMessage) {
    return (
      <View
        onLayout={props.onLayout}
        style={{
          marginVertical: global.styles.$spacing_col_sm,
        }}>
        {props.children}
      </View>
    )
  }
  return (
    <View onLayout={props.onLayout}>
      <Container {...props.chatMessage} children={props.children} />
    </View>
  )
}

const Container: React.FC<SqliteMessage> = props => {
  const state = useStore<ReducerTypes>().getState()
  const userInfo = state.serverUser.userInfo!
  // 用户昵称
  let nickname: string
  if (props.type === MessageType.SEND) {
    nickname = userInfo.nickname
  } else if (state.serverUser.cachedUser[props.uid]) {
    const temp = state.serverUser.cachedUser[props.uid]
    nickname = temp.nickname ? temp.nickname : '用户' + temp.userId
  } else {
    // TODO 用户信息缺省时发送请求获取
    nickname = 'NAME'
  }

  // 要显示的头像uid
  let uid
  if (props.type === MessageType.SEND) {
    uid = userInfo.uid
  } else {
    uid = props.uid
  }
  return (
    <View
      style={[
        {
          flexDirection:
            props.type === MessageType.SEND ? 'row-reverse' : 'row',
        },
        styles.container,
      ]}>
      <Avatar uid={uid} />
      <View
        style={[
          {
            alignItems:
              props.type === MessageType.SEND ? 'flex-end' : 'flex-start',
          },
          styles.contentContainer,
        ]}>
        <Text style={styles.nameText}>{nickname}</Text>
        <View>{props.children}</View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: global.styles.$spacing_col_base,
    marginHorizontal: global.styles.$spacing_row_base,
  },
  nameText: {
    fontSize: global.styles.$font_size_sm,
    marginBottom: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
})

export default MessageContainer
