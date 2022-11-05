import { getLogger } from '../../../utils/LoggerUtils'
import ChatResponseMessage, {
  ChatResponseMessageFactory,
} from './ChatResponseMessage'
import ServerResponseMessage, {
  ServerResponseMessageFactory,
} from './ServerResponseMessage'
import ByteBuffer from 'bytebuffer'
import { Message, MessageFactory } from './Message'

const logger = getLogger('/api/message/Message')
const messageFactories: Array<MessageFactory> = []
messageFactories[ChatResponseMessage.MESSAGE_TYPE] = ChatResponseMessageFactory
messageFactories[ServerResponseMessage.MESSAGE_TYPE] =
  ServerResponseMessageFactory
let autoRequestId = 0

/**
 * 按照协议要求，构造消息格式
 * @param message
 */
export const buildMessage = (message: Message): Uint8Array => {
  const byteBuffer = new ByteBuffer()
  byteBuffer.writeUint16(Message.MAGIC_NUMBER)
  byteBuffer.writeUint8(Message.VERSION)
  byteBuffer.writeUint8(message.getMessageType())
  // 自动分配
  byteBuffer.writeUint16(autoRequestId++)
  const enc = message.encode()
  byteBuffer.writeUint32(enc.length)
  byteBuffer.append(enc)
  byteBuffer.flip()
  if (__DEV__) {
    logger.debug(byteBuffer.toDebug())
  }
  return new Uint8Array(byteBuffer.toArrayBuffer())
}

export const parseMessage = (byteBuffer: ByteBuffer): Message | null => {
  const magic = byteBuffer.readUint16()
  if (magic !== Message.MAGIC_NUMBER) {
    logger.error(
      `invalid magic number! expected: ${Message.MAGIC_NUMBER}, receive: ${magic}, bytebuffer: ${byteBuffer}`
    )
    return null
  }
  // version
  byteBuffer.readUint8()
  // message type
  const type = byteBuffer.readUint8()
  const factory = messageFactories[type]
  if (!factory) {
    logger.error(
      `invalid message type number! receive: ${type}, bytebuffer: ${byteBuffer}`
    )
    return null
  }
  // request id
  byteBuffer.readUint16()
  const len = byteBuffer.readUint32()
  return factory(byteBuffer, len)
}