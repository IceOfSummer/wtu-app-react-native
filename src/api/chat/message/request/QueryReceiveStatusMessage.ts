import { RequestMessage } from '../Message'

export default class QueryReceiveStatusMessage extends RequestMessage {
  public static readonly MESSAGE_TYPE = 7

  encode(): Uint8Array {
    return Uint8Array.from([])
  }

  get messageType(): number {
    return QueryReceiveStatusMessage.MESSAGE_TYPE
  }
}
