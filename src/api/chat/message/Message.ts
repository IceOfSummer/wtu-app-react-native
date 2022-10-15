import ByteBuffer from 'bytebuffer'

export const buildMessage = (message: Message): Uint8Array => {
  const byteBuffer = new ByteBuffer()
  byteBuffer.writeUint16(Message.MAGIC_NUMBER)
  byteBuffer.writeUint8(Message.VERSION)
  byteBuffer.writeUint8(message.getMessageType())
  const enc = message.encode()
  byteBuffer.writeUint32(enc.length)
  byteBuffer.writeUTF8String(enc)
  byteBuffer.flip()
  if (__DEV__) {
    console.log(byteBuffer.toDebug())
  }
  return new Uint8Array(byteBuffer.toArrayBuffer())
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
   * 将数据体进行编码
   */
  abstract encode(): string

  /**
   * 获取消息类型
   */
  abstract getMessageType(): number
}
