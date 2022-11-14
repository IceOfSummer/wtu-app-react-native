import { AbstractChatMessage } from '../AbstractChatMessage'
import { SqliteMessage } from '../../../../sqlite/message'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ChatMessageFactory } from '../AbstractMessage'

export default class NormalMessage extends AbstractChatMessage {
  public static readonly MESSAGE_TYPE = 0

  /**
   * @param originContent 没有编码的原始内容
   * @param chatMessage {@link SqliteMessage#content} 应该是编码后的内容
   */
  public constructor(originContent: string, chatMessage: SqliteMessage) {
    super(NormalMessage.MESSAGE_TYPE, chatMessage, originContent)
  }

  render(): React.ReactNode {
    return <NormalMessageComponent content={this.decodedContent} />
  }
}

interface NormalMessageComponentProps {
  content: string
}

const NormalMessageComponent: React.FC<NormalMessageComponentProps> = props => {
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
