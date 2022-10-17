import React from 'react'
import { Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { insertSingleMessage } from '../../../../redux/counter/messageSlice'
import { ReducerTypes } from '../../../../redux/counter'
import MessageBlock from '../../components/MessageBlock'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { MessageLabel } from '../../../../redux/types/messageTypes'

const Chat: React.FC = () => {
  const dispatch = useDispatch()
  const lastMsg = useSelector<ReducerTypes, MessageLabel>(
    state => state.message.messageLabels
  )
  const ent = Object.entries(lastMsg)

  const inrMsg = () => {
    dispatch(
      insertSingleMessage({
        confirm: 0,
        sender: 1,
        msg: {
          sendTo: 2,
          content: 'hello-' + Date.now(),
          createTime: Date.now(),
          type: 1,
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
