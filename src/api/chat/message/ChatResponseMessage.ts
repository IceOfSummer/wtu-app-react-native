import { Message, MessageFactory } from './Message'
import {
  ChatResponseMessage as ChatResponseMessageProto,
  decodeChatResponseMessage,
  encodeChatResponseMessage,
} from '../proto/ChatResponseMessage'

export default class ChatResponseMessage extends Message {
  public static readonly MESSAGE_TYPE = 4

  private readonly _message: ChatResponseMessageProto

  constructor(message: ChatResponseMessageProto) {
    super()
    this._message = message
  }

  encode(): Uint8Array {
    return encodeChatResponseMessage(this._message)
  }

  getMessageType(): number {
    return 4
  }

  get message(): ChatResponseMessageProto {
    return this._message
  }
}

export const ChatResponseMessageFactory: MessageFactory = msg => {
  return new ChatResponseMessage(decodeChatResponseMessage(msg))
}
