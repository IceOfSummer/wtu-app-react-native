import { Message } from './Message'

export default class AuthRequestMessage extends Message {
  private static readonly MESSAGE_TYPE = 0

  private readonly session: string

  constructor(session: string) {
    super()
    this.session = session
  }

  encode(): Uint8Array {
    return Buffer.from(this.session)
  }

  getMessageType(): number {
    return AuthRequestMessage.MESSAGE_TYPE
  }
}
