import AbstractMessage from './AbstractMessage'
import { SqliteMessage } from '../../../sqlite/message'

/**
 * 用户之间的聊天消息
 */
export abstract class AbstractChatMessage extends AbstractMessage {
  public static readonly CHAT_MESSAGE_GROUP = 1

  protected constructor(
    messageType: number,
    chatMessage: SqliteMessage,
    decodedContent?: string
  ) {
    super({
      messageGroup: AbstractChatMessage.CHAT_MESSAGE_GROUP,
      messageType,
      chatMessage,
      decodedContent: decodedContent
        ? decodedContent
        : AbstractMessage.removeTypeMarker(chatMessage.content),
      key: chatMessage.messageId,
      createTime: chatMessage.createTime,
    })
  }

  get message(): SqliteMessage {
    return this._message!
  }
}
