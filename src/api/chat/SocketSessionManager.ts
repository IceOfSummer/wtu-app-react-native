import { TLSSocket } from 'react-native-tcp-socket/lib/types/Server'
import { getLogger } from '../../utils/LoggerUtils'
import config from '../../../config.json'
import { ConnectionOptions } from 'react-native-tcp-socket/lib/types/Socket'
import { TLSSocketOptions } from 'react-native-tcp-socket/lib/types/TLSSocket'
import TcpSockets from 'react-native-tcp-socket'

const logger = getLogger('/api/chat/SocketSessionManager')

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

/**
 * 用于管理socket的连接、重连等
 */
export default class SocketSessionManager {
  /**
   * 当连接重置后的回调
   */
  public onConnectionReset?: () => void

  /**
   * 当连接建立后的回调
   */
  public onConnected?: (socket: TLSSocket) => void

  private _connection: TLSSocket | null = null

  /**
   * 是否正在等待连接
   * @private
   */
  private _isPending: boolean = false

  /**
   * 绑定重连等事件
   * @private
   */
  private bindEvent() {
    if (!this._connection) {
      logger.error('this property "connection" is null! can not bind event')
      return
    }
    this._connection.on('close', () => {
      logger.info('socket is closed, reconnecting')
      this.reset()
      this.getConnection()
    })
  }

  /**
   * 获取TLS连接，如果正在连接中则会返回null
   */
  public getConnection(): TLSSocket | null {
    if (this._connection) {
      return this._connection
    }
    if (this._isPending) {
      return null
    }
    this.tryConnect()
    return null
  }

  private tryConnect() {
    this._isPending = true
    logger.info(`trying to connect to ${host}:${port}`)
    const client = TcpSockets.connectTLS(options, () => {
      logger.info(`successfully connected to ${host}:${port}`)
      this._isPending = false
      this.bindEvent()
      this.onConnected?.(client)
    })
    this.bindRetryEvent(client)
    this._connection = client
  }

  private bindRetryEvent(client: TLSSocket) {
    client.on('error', error => {
      logger.error('connect failed: ' + error + ' , retry in 8s')
      this._isPending = false
      this._connection?.removeAllListeners('error')
      client.destroy()
      setTimeout(() => {
        this.tryConnect()
      }, 8000)
    })
  }

  private reset() {
    this._connection = null
    this._isPending = false
    this.onConnectionReset?.()
  }
}
