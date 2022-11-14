import React from 'react'
import { SqliteMessage } from '../../../sqlite/message'

/**
 * <b>消息基类</b>
 *
 * <b>若消息结构不符合要求，应该放弃解析，将整个消息当做普通的消息</b>
 *
 * 更多详细信息请查阅本目录下的[README.md](./README.md)
 */
abstract class AbstractChatMessage {
  /**
   * 若消息结构有误或者为未知的消息，将其置为该值
   */
  public static readonly UNKNOWN_MESSAGE_TYPE = -1

  /**
   * 消息内容，不包含前缀的分隔符
   * @private
   */
  private readonly _content: string

  /**
   * 消息类型</p>
   *
   * 若该值为负数，代表该消息即使从服务器接收，也会将其归类为错误消息。
   * @private
   */
  private readonly _messageType: number

  /**
   * 唯一key
   */
  private readonly _key: number | string

  /**
   * 消息详细, 用于组件渲染
   * @private
   */
  private readonly _chatMessage: SqliteMessage | undefined

  /**
   * 是否隐藏头像, 消息在渲染前在外层会用头像等其它内容包括起来，将该值设置为false以取消包裹
   *
   * <b>若构造器中的chatMessage参数非空，则该值自动设为true, 反正为false</b>
   * @protected
   */
  protected _hideAvatar: boolean

  protected constructor(
    content: string,
    messageType: number,
    chatMessage?: SqliteMessage,
    key?: number | string
  ) {
    this._content = content
    this._chatMessage = chatMessage
    this._messageType = messageType
    this._key = key ? key : AbstractChatMessage.autoGenerateKey()
    this._hideAvatar = !chatMessage
  }

  /**
   * 将当前实例对象加密为对应格式的字符串消息</p>
   *
   * 若当前消息没有必要加密(即该消息的传输是无意义的)，则应返回一个空字符串
   */
  public abstract encodeMsg(): string

  /**
   * 渲染对应的React组件<p/>
   *
   * 若使用数组的<code>map()</code>进行渲染，<b>不要</b>直接调用该方法，应该在外套上一层并指定唯一的key以避免重复刷新
   */
  public abstract render(): React.ReactNode

  get content(): string {
    return this._content
  }

  get messageType(): number {
    return this._messageType
  }

  get key(): number | string {
    return this._key
  }

  private static counter: number = -1

  private static autoGenerateKey(): number {
    return AbstractChatMessage.counter--
  }

  get chatMessage(): SqliteMessage | undefined {
    return this._chatMessage
  }

  get hideAvatar(): boolean {
    return this._hideAvatar
  }

  private static readonly REPLACE_TYPE_MARKER = /§\d*§/g

  public static removeTypeMarker(content: string): string {
    return content.replace(AbstractChatMessage.REPLACE_TYPE_MARKER, '')
  }
}

/**
 * 消息工厂
 * @param param 消息解析完成后传入的字符串，可以直接使用，不包含分隔符
 * @param chatMessage 原始的数据体，其`content`属性仍然是未解析的消息，请小心使用
 */
export type ChatMessageFactory = (
  param: string,
  chatMessage: SqliteMessage
) => AbstractChatMessage

export default AbstractChatMessage
