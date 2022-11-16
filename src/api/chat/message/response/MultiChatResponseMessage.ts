import { MessageFactory, ResponseMessage } from '../Message'
import {
  ChatResponseMessage,
  ChatResponseMessageGroup,
  decodeChatResponseMessageGroup,
} from '../../proto/ChatResponseMessage'

export class MultiChatResponseMessage extends ResponseMessage {
  public static readonly MESSAGE_TYPE = 6

  private readonly _messages: ChatResponseMessage[]

  public constructor(messages: ChatResponseMessageGroup) {
    super()
    this._messages = messages.messages ? messages.messages : []
    this._messages.forEach(value => {
      value.createTime *= 1000
    })
  }

  get messages(): ChatResponseMessage[] {
    return this._messages
  }

  get messageType(): number {
    return MultiChatResponseMessage.MESSAGE_TYPE
  }
}

export const MultiChatMessageFactory: MessageFactory = msg => {
  return new MultiChatResponseMessage(decodeChatResponseMessageGroup(msg))
}
