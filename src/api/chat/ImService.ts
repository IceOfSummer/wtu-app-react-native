import ImTemplate from './ImTemplate'
import ChatRequestMessage from './message/request/ChatRequestMessage'
import { getMaxMsgId, MessageType } from '../../sqlite/message'
import { getLogger } from '../../utils/LoggerUtils'
import SyncRequestMessage from './message/request/SyncRequestMessage'
import { MultiChatResponseMessage } from './message/response/MultiChatResponseMessage'
import {
  insertSingleMessage,
  syncMessage,
} from '../../redux/counter/messageSlice'
import { store } from '../../redux/store'
import { encodeContent } from '../../views/ChatPage/message/MessageManager'
import NormalMessage from '../../views/ChatPage/message/chat/NormalMessage'
import { showSingleBtnTip } from '../../native/modules/NativeDialog'

const logger = getLogger('/api/chat/ImService')

/**
 * 聊天服务管理, 用于管理消息的发送以及同步.
 * <p>
 */
export class ImService {
  /**
   * 单例模式
   * @private
   */
  private static _INSTANCE: ImService

  private readonly imTemplate: ImTemplate = ImTemplate.instance

  private lastMsgId: number = -1

  private isInitDone: boolean = false

  private constructor() {
    // 同步lastMsgId
    getMaxMsgId()
      .then(val => {
        logger.info('同步消息id: ' + val)
        this.lastMsgId = val
        this.isInitDone = true
        if (this.imTemplate.isReady()) {
          this.syncOfflineMessage()
        }
      })
      .catch(e => {
        logger.error('init max id failed: ' + e.message)
        showSingleBtnTip(
          '连接初始化失败',
          '你可以忽略该错误，该错误不会影响正常使用 )'
        )
      })
  }

  /**
   * 发送聊天消息
   * @param to 发给谁
   * @param content 消息内容
   */
  public async sendChatMessage(to: number, content: string): Promise<void> {
    if (!this.isInitDone) {
      throw new Error('正在加载中')
    }
    const encodedContent = encodeContent(NormalMessage.MESSAGE_TYPE, content)
    const response = await this.imTemplate.sendMessage(
      new ChatRequestMessage(to, encodedContent)
    )

    if (!response.success) {
      throw new Error('消息发送失败')
    }
    const messageId = Number.parseInt(response.data!, 10)
    this.updateMsgId(messageId)
    // 保存redux
    store.dispatch<any>(
      insertSingleMessage({
        msg: {
          uid: to,
          type: MessageType.SEND,
          messageId,
          content: encodedContent,
          createTime: Date.now(),
        },
        unread: 1,
      })
    )
  }

  /**
   * 更新消息id, 若有同步的需要，则进行同步
   * @param msgId 当前收到的消息id
   */
  public updateMsgId(msgId: number) {
    if (msgId !== this.lastMsgId + 1) {
      // 同步
      logger.info(`start sync message from ${this.lastMsgId + 1} to ${msgId}`)
      this.syncMessage(this.lastMsgId + 1, msgId).catch(e => {
        logger.error('sync message failed: ' + e.message)
      })
    }
    this.lastMsgId = msgId
  }

  /**
   * 同步消息, 消息不一定会拿到
   * @param start 消息的起始id（包括）
   * @param end 若提供该值，则进行在线消息同步。<p>
   *   若为离线同步，则一定可以拿到指定的消息，若为在线，则不一定会拿到消息<p>
   *   在线一般用于用户在聊天的过程中丢失了消息，能够快速进行同步，速度较快，但不一定会全部拿到<p>
   *   离线代表用户接收离线消息，一定可以拿到范围内的内容<p>
   * @private
   */
  private syncMessage(start: number, end?: number) {
    const offline = end === undefined
    return this.imTemplate
      .sendMessage<MultiChatResponseMessage>(
        new SyncRequestMessage({
          offline,
          start,
          end,
        })
      )
      .then(resp => {
        logger.info('sync message success!')
        store.dispatch<any>(
          syncMessage({
            confirmed: offline ? 0 : 1,
            messages: resp,
          })
        )
      })
  }

  /**
   * 同步离线消息
   */
  public syncOfflineMessage() {
    logger.info(`sync message from messageId ${this.lastMsgId}`)
    this.syncMessage(this.lastMsgId + 1).catch(e => {
      logger.error('sync message failed: ' + e.message)
    })
  }

  static get INSTANCE(): ImService {
    if (!this._INSTANCE) {
      this._INSTANCE = new ImService()
    }
    return this._INSTANCE
  }
}
