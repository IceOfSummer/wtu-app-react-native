import { Message, MessageFactory } from './Message'
import {
  decodeOnlineChatMessage,
  OnlineChatMessage,
} from '../proto/OnlineChatMessage'
import { encodeChatMessage } from '../proto/ChatMessage'
import Buffer from 'buffer'

export default class ChatResponseMessage extends Message {
  public static readonly MESSAGE_TYPE = 4

  private message: OnlineChatMessage

  constructor(message: OnlineChatMessage) {
    super()
    this.message = message
  }

  encode(): Uint8Array {
    return encodeChatMessage(this.message)
  }

  getMessageType(): number {
    return 4
  }
}

export const ChatResponseMessageFactory: MessageFactory = msg => {
  const buf = Buffer.Buffer.from(msg.view.buffer.slice(msg.offset, msg.limit))
  return new ChatResponseMessage(decodeOnlineChatMessage(buf))
}
