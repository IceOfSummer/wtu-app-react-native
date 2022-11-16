import { RequestMessage } from '../Message'
import Buffer from 'buffer'

export default class AuthRequestMessage extends RequestMessage {
  private static readonly MESSAGE_TYPE = 0

  private readonly session: string

  constructor(session: string) {
    super()
    this.session = session
  }

  encode(): Uint8Array {
    return Buffer.Buffer.from(this.session)
  }

  get messageType(): number {
    return AuthRequestMessage.MESSAGE_TYPE
  }
}
