import React from 'react'
import { Button, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { insertSingleMessage } from '../../../../redux/counter/messageSlice'

const Chat: React.FC = () => {
  const dispatch = useDispatch()

  const inrMsg = () => {
    dispatch(
      insertSingleMessage({
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
      <Text>chat</Text>
    </View>
  )
}

export default Chat
