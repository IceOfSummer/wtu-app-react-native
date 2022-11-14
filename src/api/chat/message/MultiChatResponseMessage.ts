import { Message, MessageFactory } from './Message'
import {
  ChatResponseMessageGroup,
  decodeChatResponseMessageGroup,
} from '../proto/ChatResponseMessage'

export class MultiChatResponseMessage extends Message {
  public static readonly MESSAGE_TYPE = 6

  private readonly _messages: ChatResponseMessageGroup

  public constructor(messages: ChatResponseMessageGroup) {
    super()
    this._messages = messages
    messages.messages.forEach(value => {
      value.createTime *= 1000
    })
  }

  encode(): Uint8Array {
    return Uint8Array.from([])
  }

  getMessageType(): number {
    return MultiChatResponseMessage.MESSAGE_TYPE
  }

  get messages(): ChatResponseMessageGroup {
    return this._messages
  }
}

export const MultiChatMessageFactory: MessageFactory = msg => {
  return new MultiChatResponseMessage(decodeChatResponseMessageGroup(msg))
}
