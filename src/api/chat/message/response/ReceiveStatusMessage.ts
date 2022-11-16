import { MessageFactory, ResponseMessage } from '../Message'
import {
  decodeReceiveStatus,
  ReceiveStatus,
} from '../../proto/ReceiveStatusMessage'

export default class ReceiveStatusMessage extends ResponseMessage {
  public static readonly MESSAGE_TYPE = 8

  private readonly status: ReceiveStatus

  constructor(status: ReceiveStatus) {
    super()
    this.status = status
  }

  get messageType(): number {
    return ReceiveStatusMessage.MESSAGE_TYPE
  }
}

export const receiveStatusMessageFactory: MessageFactory = msg =>
  new ReceiveStatusMessage(decodeReceiveStatus(msg))
