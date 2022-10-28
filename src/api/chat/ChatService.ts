import TcpSockets from 'react-native-tcp-socket'
import { ConnectionOptions } from 'react-native-tcp-socket/lib/types/Socket'
import { buildMessage, Message } from './message/Message'
import config from '../../../config.json'
import { TLSSocketOptions } from 'react-native-tcp-socket/lib/types/TLSSocket'
import { TLSSocket } from 'react-native-tcp-socket/lib/types/Server'
import { getLogger } from '../../utils/LoggerUtils'
import LinkedOneWayQueue, {
  OneWayQueue,
} from '../../utils/Queue/LinkedOneWayQueue'
import CookieManager from '@react-native-cookies/cookies'
import AuthRequestMessage from './message/AuthRequestMessage'
import ByteBuffer from 'bytebuffer'

const logger = getLogger('/api/chat/ChatService')

const host = __DEV__
  ? config.debug.chatServerHost
  : config.release.chatServerHost

const port = __DEV__
  ? config.debug.chatServerPort
  : config.release.chatServerPort

const options: ConnectionOptions & TLSSocketOptions = {
  port,
  host,
  reuseAddress: true,
  // TODO 开发环境替换证书
  ca: require('./cert.pem'),
}

export default class ChatService {
  /**
   * 单例模式
   * @private
   */
  private static _instance: ChatService | undefined

  private client: TLSSocket

  private frameDecoder: FrameDecoder

  /**
   * 一个消息队列，用于保存响应的消息
   *
   * @private
   */
  private messageQueue: OneWayQueue<string>

  private constructor(socket: TLSSocket) {
    this.client = socket
    this.messageQueue = new LinkedOneWayQueue()
    this.frameDecoder = new FrameDecoder(6)
    this.bindEvent()
  }

  /**
   * 单例模式
   */
  static get instance(): ChatService {
    if (!ChatService._instance) {
      // connect
      logger.info(`trying to connect to ${host}:${port}`)
      const client = TcpSockets.connectTLS(options, () => {
        logger.debug('init')
      })
      logger.info(`successfully connected to ${host}:${port}`)
      client.setKeepAlive(true)
      // client.setEncoding('utf8')
      this._instance = new ChatService(client)
      return this._instance
    }
    return ChatService._instance
  }

  /**
   * 发送消息给服务器
   * <p>
   * 发送前请确保登录过了，可以直接调用{@link ChatService#tryAuth}来登录
   * @param message 消息内容
   */
  public sendMessage(message: Message): void {
    const msg = buildMessage(message)
    this.client.write(msg, 'utf8', err => {
      // 当err为空时，代表服务器已经接收到相关消息了
      if (err) {
        throw err
      }
      logger.info(err)
    })
  }

  /**
   * 绑定一些基础事件，主要用于日志
   * @private
   */
  private bindEvent() {
    this.client.on('data', data => {
      // 经测试，此处仍然存在粘包、半包等问题, 不能直接使用
      this.frameDecoder.append(data)
      while (this.frameDecoder.isNotEmpty()) {
        const bufData = this.frameDecoder.pop()
        logger.info('received data length: ' + bufData.limit)
      }
    })

    this.client.on('error', error => {
      logger.error(error)
    })

    this.client.on('close', () => {
      logger.info('connection closed')
      ChatService._instance = undefined
    })
  }

  /**
   * 尝试登录
   */
  public tryAuth(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const cookies = await CookieManager.get(global.constant.serverBaseUrl)
      const session = cookies[global.constant.sessionCookieName] as any
      if (!session) {
        reject(new Error('请先登录'))
        return
      }
      const sessionValue = session.value as string
      this.sendMessage(new AuthRequestMessage(sessionValue))
      resolve()
    })
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

  /**
   * 数据长度的字节数
   * <p>
   * 暂时固定为4
   * @private
   */
  private readonly lengthFieldLength: number = 4

  public constructor(lengthFieldOffset: number) {
    this.buffer = new ByteBuffer(1024)
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
      this.buffer.append(ByteBuffer.wrap(data))
    }
    let result: ByteBuffer | null
    // 放在while循环里，防止出现粘包
    while ((result = this.checkBuffer())) {
      this.decodedFrame.push(result)
    }
  }

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
    this.buffer.limit = bufLen
    this.buffer.compact()
    return parsedBuf
  }
}
