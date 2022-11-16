import { RequestMessage } from '../Message'
import {
  encodeSyncRequestMessage,
  SyncRequestMessage as SyncRequestMessageProto,
} from '../../proto/SyncRequestMessage'

export default class SyncRequestMessage extends RequestMessage {
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

  get messageType(): number {
    return SyncRequestMessage.MESSAGE_TYPE
  }
}
