import React from 'react'
import { SpringScrollView } from 'react-native-spring-scrollview'
import useMessageManager from '../../hook/useMessageManager'
import MessageContainer from '../MessageContainer'

interface MessageAreaProps {
  chatWith: number
}

const MessageArea: React.FC<MessageAreaProps> = props => {
  const [messages, loadMore] = useMessageManager(props.chatWith)
  return (
    <SpringScrollView showsVerticalScrollIndicator>
      {messages.map(value => (
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
