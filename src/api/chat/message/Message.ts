import { Buffer } from 'buffer'

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
   * 请求id
   * @protected
   */
  protected _requestId = 0

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

  set requestId(value: number) {
    this._requestId = value
  }
}

/**
 * 消息工厂
 * @param byteBuffer {Buffer} 消息内容
 * @param length {number} 消息内容长度
 */
export type MessageFactory = (byteBuffer: Buffer) => Message
