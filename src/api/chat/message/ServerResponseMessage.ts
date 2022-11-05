import { Message, MessageFactory } from './Message'

export default class ServerResponseMessage extends Message {
  public static readonly MESSAGE_TYPE = 2

  private readonly code: number

  constructor(code: number) {
    super()
    this.code = code
  }

  encode(): Uint8Array {
    const byteCode = []
    byteCode[0] = this.code & 0xff
    byteCode[1] = (this.code >> 8) & 0xff
    byteCode[2] = (this.code >> 16) & 0xff
    byteCode[3] = (this.code >> 24) & 0xff
    return Uint8Array.from(byteCode)
  }

  getMessageType(): number {
    return ServerResponseMessage.MESSAGE_TYPE
  }
}

export const ServerResponseMessageFactory: MessageFactory = msg => {
  return new ServerResponseMessage(msg.readUint32())
}
