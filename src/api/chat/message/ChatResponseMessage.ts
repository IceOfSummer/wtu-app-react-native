import { Message, MessageFactory } from './Message'
import {
  decodeOnlineChatMessage,
  OnlineChatMessage,
} from '../proto/OnlineChatMessage'
import { encodeChatMessage } from '../proto/ChatMessage'
import Buffer from 'buffer'

export default class ChatResponseMessage extends Message {
  public static readonly MESSAGE_TYPE = 4

  private readonly _message: OnlineChatMessage

  constructor(message: OnlineChatMessage) {
    super()
    this._message = message
  }

  encode(): Uint8Array {
    return encodeChatMessage(this._message)
  }

  getMessageType(): number {
    return 4
  }

  get message(): OnlineChatMessage {
    return this._message
  }
}

export const ChatResponseMessageFactory: MessageFactory = msg => {
  const buf = Buffer.Buffer.from(msg.view.buffer.slice(msg.offset, msg.limit))
  return new ChatResponseMessage(decodeOnlineChatMessage(buf))
}
