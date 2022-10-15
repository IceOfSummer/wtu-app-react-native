import { Message } from './Message'
import { encodeChatMessage } from '../proto/ChatMessageProto'

export default class ChatRequestMessage extends Message {
  public static readonly MESSAGE_TYPE = 1

  public to: number

  public content: string

  constructor(to: number, message: string) {
    super()
    this.to = to
    this.content = message
  }

  encode(): string {
    return encodeChatMessage({
      to: this.to,
      content: this.content,
    }).toString()
  }

  getMessageType(): number {
    return ChatRequestMessage.MESSAGE_TYPE
  }
}
