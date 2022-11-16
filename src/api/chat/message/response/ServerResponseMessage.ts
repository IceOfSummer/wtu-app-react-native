import { MessageFactory, ResponseMessage } from '../Message'
import {
  decodeServerResponseMessage,
  ServerResponseMessage as ServerResponseMessageProto,
} from '../../proto/ServerResponseMessage'

export default class ServerResponseMessage extends ResponseMessage {
  public static readonly MESSAGE_TYPE = 2

  public readonly success: boolean

  public readonly data?: string

  constructor(message: ServerResponseMessageProto) {
    super()
    this._requestId = message.requestId
    this.success = message.success
    this.data = message.data
  }

  get messageType(): number {
    return ServerResponseMessage.MESSAGE_TYPE
  }
}

export const ServerResponseMessageFactory: MessageFactory = msg => {
  return new ServerResponseMessage(decodeServerResponseMessage(msg))
}
