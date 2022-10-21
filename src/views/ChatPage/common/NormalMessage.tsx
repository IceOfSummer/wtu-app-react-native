import AbstractChatMessage, { ChatMessageFactory } from './AbstractChatMessage'
import React from 'react'
import { ChatMessage, MessageType } from '../../../sqlite/message'
import { StyleSheet, Text, View } from 'react-native'
import { getLogger } from '../../../utils/LoggerUtils'

const logger = getLogger('/views/ChatPage/common/NormalMessage')

export default class NormalMessage extends AbstractChatMessage {
  public static readonly MESSAGE_TYPE = 0

  constructor(content: string, chatMessage: ChatMessage) {
    super(content, NormalMessage.MESSAGE_TYPE, chatMessage)
  }

  encodeMsg(): string {
    return ''
  }

  render() {
    if (!this.chatMessage) {
      logger.error(
        'the ChatMessage param is undefined! content: ' + this.content
      )
      return null
    }
    return (
      <NormalMessageComponent
        content={this.content}
        type={this.chatMessage.type}
      />
    )
  }
}

interface NormalMessageComponentProps {
  content: string
  type: MessageType
}

const NormalMessageComponent: React.FC<NormalMessageComponentProps> = props => {
  console.log('render')
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.colors.boxBackgroundColor,
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: global.colors.textColor,
  },
})

export const normalMessageFactory: ChatMessageFactory = (
  content,
  chatMessage
) => new NormalMessage(content, chatMessage)
