import React from 'react'
import { Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { insertSingleMessage } from '../../../../redux/counter/messageSlice'
import { ReducerTypes } from '../../../../redux/counter'
import MessageBlock from '../../components/MessageBlock'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { MessageLabel } from '../../../../redux/types/messageTypes'
import { MessageType } from '../../../../sqlite/message'
import { appendMessagePrefix } from '../../../../views/ChatPage/common/MessageManager'

const Chat: React.FC = () => {
  const dispatch = useDispatch()
  const lastMsg = useSelector<ReducerTypes, MessageLabel>(
    state => state.message.messageLabels
  )
  const ent = Object.entries(lastMsg)

  const inrMsg = () => {
    const content = appendMessagePrefix(1, 'hello world ' + Date.now())
    console.log(content)
    dispatch(
      insertSingleMessage({
        confirm: 1,
        msg: {
          username: 2,
          content,
          createTime: Date.now(),
          type: MessageType.SEND,
        },
      })
    )
  }

  return (
    <SpringScrollView showsVerticalScrollIndicator>
      <Button title="测试" onPress={inrMsg} />
      {ent.map(([key, value]) =>
        value ? <MessageBlock {...value} key={key} /> : null
      )}
    </SpringScrollView>
  )
}

export default Chat
