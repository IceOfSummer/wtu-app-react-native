import ByteBuffer from 'bytebuffer'

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
  abstract encode(): Uint8Array

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
