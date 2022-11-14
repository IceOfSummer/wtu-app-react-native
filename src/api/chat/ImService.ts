import ImTemplate from './ImTemplate'
import ChatRequestMessage from './message/ChatRequestMessage'
import { getMaxMsgId, MessageType } from '../../sqlite/message'
import { quickShowErrorTip } from '../../native/modules/NativeDialog'
import { getLogger } from '../../utils/LoggerUtils'
import SyncRequestMessage from './message/SyncRequestMessage'
import { MultiChatResponseMessage } from './message/MultiChatResponseMessage'
import {
  insertSingleMessage,
  syncMessage,
} from '../../redux/counter/messageSlice'
import { appendMessagePrefix } from '../../views/ChatPage/common/MessageManager'
import NormalMessage from '../../views/ChatPage/common/NormalMessage'
import { store } from '../../redux/store'

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

  private ready: boolean = false

  private constructor() {
    // 同步lastMsgId
    getMaxMsgId()
      .then(val => {
        logger.info('同步消息id: ' + val)
        this.lastMsgId = val
        this.ready = true
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
    if (!this.ready) {
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
          content: appendMessagePrefix(NormalMessage.MESSAGE_TYPE, content),
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
        store.dispatch<any>(syncMessage(resp))
      })
      .catch(e => {
        console.log(e)
      })
  }

  static get INSTANCE(): ImService {
    if (!this._INSTANCE) {
      this._INSTANCE = new ImService()
    }
    return this._INSTANCE
  }
}
