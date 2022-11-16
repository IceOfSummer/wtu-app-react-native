import { Message } from './message/Message'
import { TLSSocket } from 'react-native-tcp-socket/lib/types/Server'
import { getLogger } from '../../utils/LoggerUtils'
import LinkedOneWayQueue, {
  OneWayQueue,
} from '../../utils/Queue/LinkedOneWayQueue'
import CookieManager from '@react-native-cookies/cookies'
import AuthRequestMessage from './message/request/AuthRequestMessage'
import ByteBuffer from 'bytebuffer'
import pubsub from 'pubsub-js'
import { buildMessage, parseMessage } from './message/Protocol'
import SocketSessionManager from './SocketSessionManager'
import ServerResponseMessage from './message/response/ServerResponseMessage'

const logger = getLogger('/api/chat/ChatService')

type PromiseCallFunc = (data: any) => void

/**
 * Im模板
 * <p>
 * 若要监听服务器的消息，请使用pubsub订阅{@link ImTemplate#PUBSUB_KEY}
 */
export default class ImTemplate {
  /**
   * 单例模式
   * @private
   */
  private static _instance: ImTemplate

  static get instance(): ImTemplate {
    if (!this._instance) {
      this._instance = new ImTemplate()
    }
    return this._instance
  }

  /**
   * 是否已经认证过了
   * @private
   */
  private _isAuthenticated: boolean = false

  private autoRequestId = 0

  private socketSessionManager: SocketSessionManager

  private frameDecoder: FrameDecoder

  private requestManager: MessageRequestIdManager

  /**
   * 通过pubsub监听该Key值来获取最新消息
   */
  public static readonly PUBSUB_KEY = 'ChatServiceMessage'

  /**
   * 使用pubsub向外发送消息
   * @param message
   */
  public static publishMessage(message: Message) {
    pubsub.publish(ImTemplate.PUBSUB_KEY, message)
  }

  /**
   * 一个消息队列，用于保存响应的消息
   *
   * @private
   */
  private messageQueue: OneWayQueue<string>

  private constructor() {
    this.socketSessionManager = new SocketSessionManager()
    this.messageQueue = new LinkedOneWayQueue()
    this.frameDecoder = new FrameDecoder(6)
    this.requestManager = new MessageRequestIdManager()
    this.socketSessionManager.onConnectionReset = () => {
      this._isAuthenticated = false
    }
    this.socketSessionManager.onConnected = socket => {
      this.bindEvent(socket)
      this.tryAuth().catch(() => {})
    }
  }

  /**
   * 是否准备完毕, 若为ture，则可以正常发送消息
   */
  public isReady(): boolean {
    return !!this.socketSessionManager.getConnection() && this._isAuthenticated
  }

  /**
   * 发送消息给服务器，这里会自动分配requestId，不需要手动分配
   * <p>
   * 发送前请确保登录过了，可以直接调用{@link ImTemplate#tryAuth}来登录
   * @param message 消息内容
   */
  public sendMessage<R = ServerResponseMessage>(message: Message): Promise<R> {
    const connection = this.socketSessionManager.getConnection()
    if (!connection) {
      return Promise.reject('正在连接服务器中')
    }
    return this.sendMessage0<R>(message, connection)
  }

  private sendMessage0<R>(message: Message, connection: TLSSocket): Promise<R> {
    return new Promise((resolve, reject) => {
      message.requestId = this.autoRequestId++
      this.requestManager.saveRequest(message.requestId, resolve, reject)
      const msg = buildMessage(message)
      logger.debug('sending message:')
      logger.debug(message)
      connection.write(msg, undefined, err => {
        // 当err为空时，代表服务器已经接收到相关消息了
        // 这里的回调只代表服务器成功收到了消息，但还没有回应
        if (err) {
          this.requestManager.reject(message.requestId, err)
          return
        }
      })
    })
  }

  /**
   * 绑定一些基础事件，主要用于日志
   * @private
   */
  private bindEvent(socket: TLSSocket) {
    socket.on('data', data => {
      // 经测试，此处仍然存在粘包、半包等问题, 不能直接使用
      this.frameDecoder.append(data)
      while (this.frameDecoder.isNotEmpty()) {
        const bufData = this.frameDecoder.pop()
        const message = parseMessage(bufData)
        if (!message) {
          continue
        }
        const requestId = message.requestId
        logger.debug('receive data from server: ')
        if (requestId === -1) {
          // -1代表服务器主动给用户发送信息
          logger.debug(message)
          ImTemplate.publishMessage(message)
        } else {
          logger.debug(message)
          this.requestManager.resolve(message.requestId, message)
        }
      }
    })
  }

  /**
   * 尝试登录
   */
  public tryAuth(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const conn = this.socketSessionManager.getConnection()
      if (!conn) {
        reject(new Error('正在连接服务器中'))
        return
      }
      const cookies = await CookieManager.get(global.constant.serverBaseUrl)
      const session = cookies[global.constant.sessionCookieName] as any
      if (!session) {
        reject(new Error('请先登录'))
        return
      }
      const sessionValue = session.value as string
      try {
        await this.sendMessage0(new AuthRequestMessage(sessionValue), conn)
        logger.info('聊天服务器登录成功')
        this._isAuthenticated = true
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}

class MessageRequestIdManager {
  public static readonly REQUEST_CHECK_ARR_SIZE = 128

  /**
   * 用于一一对应响应
   * @private
   */
  private messageResolveList: Array<PromiseCallFunc | undefined> = new Array<
    PromiseCallFunc | undefined
  >(MessageRequestIdManager.REQUEST_CHECK_ARR_SIZE)

  private messageRejectList: Array<PromiseCallFunc | undefined> = new Array<
    PromiseCallFunc | undefined
  >(MessageRequestIdManager.REQUEST_CHECK_ARR_SIZE)

  public saveRequest(
    requestId: number,
    resolve: PromiseCallFunc,
    reject: PromiseCallFunc
  ) {
    const index = this.getIndex(requestId)
    this.messageResolveList[index] = resolve
    this.messageRejectList[index] = reject
  }

  public resolve(requestId: number, data?: any) {
    const index = this.getIndex(requestId)
    this.invoke(index, this.messageResolveList[index], data)
  }

  public reject(requestId: number, data?: any) {
    const index = this.getIndex(requestId)
    this.invoke(index, this.messageRejectList[index], data)
  }

  private invoke(index: number, call?: PromiseCallFunc, data?: any) {
    logger.info(`request id ${index} has been successfully received`)
    if (call) {
      call(data)
    } else {
      logger.warn(`the index ${index} in request list is null! received data:`)
      logger.warn(data)
    }
    this.messageRejectList[index] = undefined
    this.messageResolveList[index] = undefined
  }

  private getIndex(requestId: number): number {
    return requestId % MessageRequestIdManager.REQUEST_CHECK_ARR_SIZE
  }
}

/**
 * 用于解决粘包、半包等问题
 * <p>
 * 每次有新消息时，通过调用{@link FrameDecoder#append()}来解析，每次添加后都有可能会有新的完整消息产生，
 * 需要通过在while循环里调用{@link FrameDecoder#isNotEmpty()}来检查是否有可用数据，之后调用{@link FrameDecoder#pop()}来取出数据。
 * <p>
 * 虽然{@link FrameDecoder#pop()}的声明中，返回值永远是非空的，但其实在内部做了<b>非空断言</b>，
 * 请务必保证在调用该方法前调用{@link FrameDecoder#isNotEmpty()}来判断是否有数据
 */
class FrameDecoder {
  private buffer: ByteBuffer

  private decodedFrame: OneWayQueue<ByteBuffer>

  private readonly lengthFieldOffset: number

  private static readonly BUFFER_SIZE = 128

  /**
   * 数据长度的字节数
   * <p>
   * 暂时固定为4
   * @private
   */
  private readonly lengthFieldLength: number = 4

  public constructor(lengthFieldOffset: number) {
    this.buffer = new ByteBuffer(FrameDecoder.BUFFER_SIZE)
    this.lengthFieldOffset = lengthFieldOffset
    this.decodedFrame = new LinkedOneWayQueue()
  }

  /**
   * 将消息添加进ByteBuf缓存，用于解析帧
   */
  public append(data: string | Buffer) {
    if (typeof data === 'string') {
      this.buffer.writeString(data)
    } else {
      this.buffer.append(data)
    }
    let result: ByteBuffer | null
    // 放在while循环里，防止出现粘包
    while ((result = this.checkBuffer())) {
      this.decodedFrame.push(result)
    }
  }

  /**
   * 返回一个完整的消息
   * <p>
   * 返回的bytebuffer<b>一定</b>是一个完整的消息
   */
  public pop(): ByteBuffer {
    const popVal = this.decodedFrame.pop()
    if (!popVal) {
      logger.error(
        'the FrameDecoder#pop is undefined! please ensure invoke FrameDecoder#isNotEmpty before this method'
      )
      throw new Error('似乎出了点问题?')
    }
    return popVal
  }

  public isNotEmpty(): boolean {
    return !this.decodedFrame.empty()
  }

  /**
   * 检查当前buffer是否可以解析出一条完整的消息，若可以，则返回解析后的消息，反之返回null
   * <p>
   * 可以解决半包造成的问题
   * @private
   */
  private checkBuffer(): ByteBuffer | null {
    this.buffer.flip()
    if (this.buffer.limit === 0) {
      // 空消息
      this.buffer.reset()
      return null
    }
    // 每次添加完毕消息后就去尝试解析
    const len = this.buffer.readUint32(this.lengthFieldOffset)
    const currentDataLength =
      this.buffer.limit - this.lengthFieldOffset - this.lengthFieldLength
    this.buffer.reset()
    if (currentDataLength < len) {
      // 半包
      this.buffer.compact()
      return null
    }
    const bufLen = this.lengthFieldOffset + this.lengthFieldLength + len
    logger.debug('successfully parsed a frame, data length: ' + bufLen)
    const parsedBuf = new ByteBuffer(bufLen)
    this.buffer.copyTo(parsedBuf, 0, 0, bufLen)
    this.buffer.offset += bufLen
    // 这个compat和java不一样，java是截取后capacity不变，这个会将capacity变为limit - offset
    // 作者在GitHub上说因为这么做好实现... https://github.com/protobufjs/bytebuffer.js/issues/73
    // 如果limit === offset，则会被判断为空buffer，不能做任何的添加操作(此时调用ensureCapacity会报错，可见源码)！
    // 因此当limit === offset时应该重新new一个buffer
    if (this.buffer.offset === this.buffer.limit) {
      this.buffer = new ByteBuffer(FrameDecoder.BUFFER_SIZE)
      return parsedBuf
    }
    this.buffer.compact()
    return parsedBuf
  }
}
