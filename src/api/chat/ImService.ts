import ImTemplate from './ImTemplate'
import ChatRequestMessage from './message/request/ChatRequestMessage'
import { getMaxMsgId, MessageType } from '../../sqlite/message'
import { quickShowErrorTip } from '../../native/modules/NativeDialog'
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
import QueryReceiveStatusMessage from './message/request/QueryReceiveStatusMessage'
import ReceiveStatusMessage from './message/response/ReceiveStatusMessage'

const logger = getLogger('/api/chat/ImService')

/**
 * 聊天服务管理, 用于管理消息的发送以及同步
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
    // 绑定回调
    this.imTemplate.onReady = () => {
      if (this.isInitDone) {
        this.syncOfflineMessage()
      }
    }
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
        quickShowErrorTip(
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
    const response = await this.imTemplate.sendMessage(
      new ChatRequestMessage(to, content)
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
          content: encodeContent(NormalMessage.MESSAGE_TYPE, content),
          createTime: Date.now(),
        },
        confirm: 1,
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
   * @param end 消息的结束id（不包括），同步完毕后，下一次的消息id的期望为<code>end - 1</code>
   * @param offline 是否为离线同步，若为离线，则一定可以拿到指定的消息，若为在线，则不一定会拿到消息
   *                在线一般用于用户在聊天的过程中丢失了消息，能够快速进行同步，速度较快，但不一定会全部拿到
   *                离线代表用户接收离线消息，一定可以拿到范围内的内容
   *                <p>
   *                - 当offline为true时，end - start不应该超过200，若超过该值应该分批次获取
   *                <p>
   *                - 当offline为false时，end - start不应该超过20, 若超过则应该丢弃较小的消息id
   * @private
   */
  private syncMessage(start: number, end: number, offline?: boolean) {
    return this.imTemplate
      .sendMessage<MultiChatResponseMessage>(
        new SyncRequestMessage({
          offline: !!offline,
          start,
          end,
        })
      )
      .then(resp => {
        logger.info('sync message success!')
        this.lastMsgId = end - 1
        store.dispatch<any>(
          syncMessage({
            confirmed: offline ? 1 : 0,
            messages: resp,
          })
        )
      })
  }

  /**
   * 同步离线消息
   */
  public syncOfflineMessage() {
    if (!this.isInitDone) {
      logger.info('socket is not ready, can not sync offline message')
      return
    }
    logger.info('started sync offline message')
    this.imTemplate
      .sendMessage<ReceiveStatusMessage>(new QueryReceiveStatusMessage())
      .then(r => {
        const start = this.lastMsgId + 1
        const end = r.status.receivedId
        logger.info('server receivedId: ' + end)
        if (end === start) {
          // 没有新消息
          return
        }
        logger.info(`sync message from messageId ${start} to ${end}`)
        this.syncMessage(start, end, true).catch(e => {
          logger.error('sync message failed: ' + e.message)
        })
      })
      .catch(e => {
        logger.error('sync offline message failed: ' + e.message)
      })
  }

  static get INSTANCE(): ImService {
    if (!this._INSTANCE) {
      this._INSTANCE = new ImService()
    }
    return this._INSTANCE
  }
}
