import ByteBuffer from 'bytebuffer'
import { getLogger } from '../../../utils/LoggerUtils'

const logger = getLogger('/api/message/Message')
const messageFactories: Array<MessageFactory> = []

/**
 * 按照协议要求，构造消息格式
 * @param message
 */
export const buildMessage = (message: Message): Uint8Array => {
  const byteBuffer = new ByteBuffer()
  byteBuffer.writeUint16(Message.MAGIC_NUMBER)
  byteBuffer.writeUint8(Message.VERSION)
  byteBuffer.writeUint8(message.getMessageType())
  byteBuffer.writeUint16(message.requestId)
  const enc = message.encode()
  byteBuffer.writeUint32(enc.length)
  byteBuffer.writeUTF8String(enc)
  byteBuffer.flip()
  if (__DEV__) {
    console.log(byteBuffer.toDebug())
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

export abstract class Message {
  /**
   * 魔数 OxAC 0x66
   */
  public static readonly MAGIC_NUMBER: number = 0xac66

  /**
   * 版本号
   */
  public static readonly VERSION = 0x01

  /**
   * 请求id，暂时没有用上
   * @protected
   */
  private _requestId = 0

  /**
   * 将数据体进行编码
   */
  abstract encode(): string

  /**
   * 获取消息类型
   */
  abstract getMessageType(): number

  get requestId(): number {
    return this._requestId
  }
}

/**
 * 消息工厂
 * @param byteBuffer {ByteBuffer} 消息内容，offset已经到消息的位置了，是读模式
 * @param length {number} 消息内容长度
 */
export type MessageFactory = (byteBuffer: ByteBuffer, length: number) => Message
