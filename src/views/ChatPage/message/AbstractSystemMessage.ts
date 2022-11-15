import AbstractMessage from './AbstractMessage'

export default abstract class AbstractSystemMessage extends AbstractMessage {
  public static readonly MESSAGE_GROUP = 2

  protected constructor(content: string) {
    super({
      messageType: -1,
      decodedContent: content,
      messageGroup: AbstractSystemMessage.MESSAGE_GROUP,
      props: {
        hideAvatar: true,
      },
      createTime: Date.now(),
    })
  }
}
