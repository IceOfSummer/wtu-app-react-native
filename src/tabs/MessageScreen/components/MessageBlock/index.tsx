import React from 'react'
import { Text, View } from 'react-native'
import { ChatMessage } from '../../../../sqlite/message'

const MessageBlock: React.FC<ChatMessage> = () => {
  return (
    <View>
      <Text>hello</Text>
    </View>
  )
}
export default MessageBlock
