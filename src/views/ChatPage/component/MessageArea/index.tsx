import React, { useEffect, useRef, useState } from 'react'
import { ScrollEvent, SpringScrollView } from 'react-native-spring-scrollview'
import useMessageManager from '../../hook/useMessageManager'
import MessageContainer from '../MessageContainer'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ChatMessage } from '../../../../sqlite/message'
import AbstractChatMessage from '../../common/AbstractChatMessage'
import NormalMessage from '../../common/NormalMessage'
import { resetCurrentTalkMessage } from '../../../../redux/counter/messageSlice'

interface MessageAreaProps {
  chatWith: number
}

const MessageArea: React.FC<MessageAreaProps> = props => {
  const [messages, loadMore] = useMessageManager(props.chatWith)
  const scroll = useRef<SpringScrollView>(null)

  // current message
  const [currentMsg, setMessage] = useState<Array<AbstractChatMessage>>([])
  const pointer = useRef(0)
  const currentTalk = useSelector<ReducerTypes, Array<ChatMessage>>(
    state => state.message.currentTalkMessages
  )
  // 是否自动去底部(当收到消息后)
  const autoToBottom = useRef(true)
  const dispatch = useDispatch()
  useEffect(() => {
    for (
      let len = currentTalk.length;
      pointer.current < len;
      ++pointer.current
    ) {
      const msg = currentTalk[pointer.current]
      if (msg.uid === props.chatWith) {
        setMessage([
          ...currentMsg,
          new NormalMessage(
            AbstractChatMessage.removeTypeMarker(msg.content),
            msg
          ),
        ])
        if (autoToBottom.current) {
          setTimeout(() => {
            scroll.current?.scrollToEnd(true)
          }, 200)
        }
      }
    }
  }, [currentTalk])
  useEffect(() => {
    return () => {
      dispatch(resetCurrentTalkMessage())
    }
  }, [])

  const onScroll = ({ nativeEvent }: ScrollEvent) => {
    // 如果nativeEvent.y === 0代表滑到了最底部
    autoToBottom.current = nativeEvent.contentOffset.y !== 0
  }
  return (
    <SpringScrollView
      showsVerticalScrollIndicator
      ref={scroll}
      style={{ paddingBottom: global.styles.$spacing_col_base }}
      onScroll={onScroll}>
      {messages.map(value => (
        <MessageContainer
          chatMessage={value.chatMessage}
          key={value.key}
          hideContainer={value.hideAvatar}>
          {value.render()}
        </MessageContainer>
      ))}
      {currentMsg.map(value => (
        <MessageContainer
          chatMessage={value.chatMessage}
          key={value.key}
          hideContainer={value.hideAvatar}>
          {value.render()}
        </MessageContainer>
      ))}
    </SpringScrollView>
  )
}

export default MessageArea
