import { MessageFactory, ResponseMessage } from '../Message'
import {
  ChatResponseMessage as ChatResponseMessageProto,
  decodeChatResponseMessage,
} from '../../proto/ChatResponseMessage'
import ChatRequestMessage from '../request/ChatRequestMessage'

export default class ChatResponseMessage extends ResponseMessage {
  public static readonly MESSAGE_TYPE = 4

  private readonly _message: ChatResponseMessageProto

  constructor(message: ChatResponseMessageProto) {
    super()
    this._message = message
  }

  get message(): ChatResponseMessageProto {
    return this._message
  }

  get messageType(): number {
    return ChatRequestMessage.MESSAGE_TYPE
  }
}

export const ChatResponseMessageFactory: MessageFactory = msg => {
  return new ChatResponseMessage(decodeChatResponseMessage(msg))
}
