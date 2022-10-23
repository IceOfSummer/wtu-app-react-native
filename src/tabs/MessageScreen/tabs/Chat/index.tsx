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
    const content = appendMessagePrefix(0, 'hello world ' + Date.now())
    console.log(content)
    for (let i = 1; i < 12; i++) {
      dispatch(
        insertSingleMessage({
          // @ts-ignore
          confirm: i % 2,
          msg: {
            username: i,
            content,
            createTime: Date.now(),
            type: i % 2 === 0 ? MessageType.SEND : MessageType.RECEIVE,
          },
        })
      )
    }
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
