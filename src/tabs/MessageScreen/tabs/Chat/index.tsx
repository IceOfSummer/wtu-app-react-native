import React from 'react'
import { Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { insertSingleMessage } from '../../../../redux/counter/messageSlice'
import { ReducerTypes } from '../../../../redux/counter'
import MessageBlock from '../../components/MessageBlock'
import { ChatMessage } from '../../../../sqlite/message'

const Chat: React.FC = () => {
  const dispatch = useDispatch()
  const lastMsg = useSelector<ReducerTypes, ChatMessage[]>(
    state => state.message.messageLabels
  )

  const inrMsg = () => {
    dispatch(
      insertSingleMessage({
        confirm: 0,
        sender: 1,
        msg: {
          sendTo: 2,
          content: 'hello',
          createTime: Date.now(),
          type: 1,
        },
      })
    )
  }

  return (
    <View>
      <Button title="测试" onPress={inrMsg} />
      {lastMsg.map(value => (
        <MessageBlock {...value} key={value.messageId} />
      ))}
    </View>
  )
}

export default Chat
