import { Buffer } from 'buffer'

/**
 * 消息基类
 *
 * 若为消息实现类建议实现如下的类
 * @see ResponseMessage 服务器响应消息
 * @see RequestMessage 客户端请求消息
 */
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
   * 请求id, 一般自动生成不需要手动设置
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
  abstract get messageType(): number

  get requestId(): number {
    return this._requestId
  }

  set requestId(value: number) {
    this._requestId = value
  }
}

export abstract class ResponseMessage extends Message {
  /**
   * 响应消息不需要编码
   */
  encode(): Uint8Array {
    return Uint8Array.from([])
  }
}

export abstract class RequestMessage extends Message {}

/**
 * 消息工厂
 * @param byteBuffer {Buffer} 消息内容
 * @param length {number} 消息内容长度
 */
export type MessageFactory = (byteBuffer: Buffer) => Message
