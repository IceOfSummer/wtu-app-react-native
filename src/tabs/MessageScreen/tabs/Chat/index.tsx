import React from 'react'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import MessageBlock from '../../components/MessageBlock'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { MessageLabel } from '../../../../redux/types/messageTypes'
import ConnectFailView from '../../components/ConnectFailView'
import { View } from 'react-native'

const Chat: React.FC = () => {
  const lastMsg = useSelector<ReducerTypes, MessageLabel>(
    state => state.message.messageLabels
  )
  const ent = Object.entries(lastMsg)

  return (
    <View style={{ flex: 1 }}>
      <ConnectFailView />
      <SpringScrollView showsVerticalScrollIndicator>
        {ent.map(([key, value]) =>
          value ? <MessageBlock {...value} key={key} /> : null
        )}
      </SpringScrollView>
    </View>
  )
}

export default Chat
