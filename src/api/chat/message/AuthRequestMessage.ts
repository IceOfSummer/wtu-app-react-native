import { Message } from './Message'
import Buffer from 'buffer'

export default class AuthRequestMessage extends Message {
  private static readonly MESSAGE_TYPE = 0

  private readonly session: string

  constructor(session: string) {
    super()
    this.session = session
  }

  encode(): Uint8Array {
    return Buffer.Buffer.from(this.session)
  }

  getMessageType(): number {
    return AuthRequestMessage.MESSAGE_TYPE
  }
}
