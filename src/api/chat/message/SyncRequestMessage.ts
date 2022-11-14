import { Message } from './Message'
import {
  encodeSyncRequestMessage,
  SyncRequestMessage as SyncRequestMessageProto,
} from '../proto/SyncRequestMessage'

export default class SyncRequestMessage extends Message {
  public static readonly MESSAGE_TYPE = 5

  private readonly message: SyncRequestMessageProto

  constructor(message: SyncRequestMessageProto) {
    super()
    this.message = message
  }

  encode(): Uint8Array {
    return encodeSyncRequestMessage(this.message)
  }

  getMessageType(): number {
    return SyncRequestMessage.MESSAGE_TYPE
  }
}
