import { SqliteMessage } from '../../../sqlite/message'
import React from 'react'
import { MessageContainerOptionalProps } from './component/MessageContainer'

type AbstractChatMessageCons = {
  decodedContent: string
  messageType: number
  createTime: number
  messageGroup?: number
  chatMessage?: SqliteMessage
  key?: number | string
  props?: MessageContainerOptionalProps
}

/**
 * 聊天消息，显示在聊天框中的内容
 */
export default abstract class AbstractMessage {
  /**
   * 用于自动生成key
   * @private
   */
  private static autoKey = 12345678

  public static readonly DEFAULT_MESSAGE_GROUP = 0

  /**
   * 双方的聊天消息，若为系统生成的消息，则可以不提供该属性，例如在消息框中插入一条时间
   * @protected
   */
  protected _message?: SqliteMessage

  /**
   * 解码后的消息
   * @protected
   */
  private readonly _decodedContent: string

  /**
   * 消息类型，应该为每一个实现类提供一个唯一的type(不应该太大)
   * <p>
   * 若提供的type为负数，表示该消息为系统自动生成的消息，即不需要为该类消息提供持久化操作
   * @protected
   */
  protected _messageType: number

  /**
   * 消息分组，把具有某种特性的消息分为一组, 不提供默认为{@link AbstractMessage#DEFAULT_MESSAGE_GROUP}
   * @protected
   */
  protected _messageGroup: number

  /**
   * 消息的<b>唯一</b>key, 若不提供则会自动生成
   * <p>
   * <b>一般只有系统自动生成的临时消息可以不提供key，否则请尽量提供</b>
   * @protected
   */
  private readonly _key: number | string

  /**
   * 消息容器属性
   * <p>
   * 消息在渲染时外层会有一个容器包裹
   * @protected
   */
  private readonly _props: MessageContainerOptionalProps

  /**
   * 创建时间, 应为毫秒级别时间戳
   * @protected
   */
  private readonly _createTime: number

  /**
   * 渲染对应的React组件<p/>
   */
  public abstract render(): React.ReactNode

  protected constructor(config: AbstractChatMessageCons) {
    this._message = config.chatMessage
    this._decodedContent = config.decodedContent
    this._messageType = config.messageType
    this._messageGroup = config.messageGroup
      ? config.messageGroup
      : AbstractMessage.DEFAULT_MESSAGE_GROUP
    this._key = config.key ? config.key : AbstractMessage.autogenerateKey()
    this._props = config.props ? config.props : {}
    this._createTime = config.createTime
  }

  private static autogenerateKey() {
    return AbstractMessage.autoKey++
  }

  private static readonly REPLACE_TYPE_MARKER = /§\d*§/g

  /**
   * 移除消息内容的type标记
   * @param content
   */
  public static removeTypeMarker(content: string): string {
    return content.replace(AbstractMessage.REPLACE_TYPE_MARKER, '')
  }

  get decodedContent(): string {
    return this._decodedContent
  }

  get key(): number | string {
    return this._key
  }

  get props(): MessageContainerOptionalProps {
    return this._props
  }

  get message(): SqliteMessage | undefined {
    return this._message
  }

  get createTime(): number {
    return this._createTime
  }
}

/**
 * 消息工厂
 * @param decodedContent 消息解析完成后传入的字符串，可以直接使用，不包含分隔符
 * @param chatMessage 原始的数据体，其`content`属性仍然是未解析的消息，请小心使用
 */
export type ChatMessageFactory = (
  decodedContent: string,
  chatMessage: SqliteMessage
) => AbstractMessage
