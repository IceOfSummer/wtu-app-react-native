import { TLSSocket } from 'react-native-tcp-socket/lib/types/Server'
import { getLogger } from '../../utils/LoggerUtils'
import config from '../../../config.json'
import { ConnectionOptions } from 'react-native-tcp-socket/lib/types/Socket'
import { TLSSocketOptions } from 'react-native-tcp-socket/lib/types/TLSSocket'
import TcpSockets from 'react-native-tcp-socket'
import { store } from '../../redux/store'
import { modifyKVData } from '../../redux/counter/temporaryDataSlice'

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
  ca: __DEV__
    ? require('./cert.pem')
    : require('../../../cert/wtu.cool_bundle.pem'),
}

export type OnConnected = (socket: TLSSocket) => void
export type OnConnectionReset = () => void

/**
 * 用于管理socket的连接、重连等
 */
export default class SocketSessionManager {
  /**
   * 当连接重置后的回调. 在该回调之后，会尝试重新连接，此时会触发{@link SocketSessionManager#onConnected}事件
   */
  private readonly onConnectionReset?: OnConnectionReset

  /**
   * 当连接建立后的回调. 此时必须进行身份验证.
   */
  private readonly onConnected: OnConnected

  private _connection: TLSSocket | null = null

  /**
   * 是否正在等待连接
   * @private
   */
  private _isPending: boolean = false

  private closed = false

  /**
   * 设置连接表示
   *
   * 当为true时，表示连接失败了，false为连接成功或正在连接
   *
   * 使用redux来管理
   * @private
   */
  private setConnectFlag(flag: boolean) {
    store.dispatch(modifyKVData({ isChatServerConnectFailed: flag }))
  }

  constructor(onConnected: OnConnected, onConnectionReset: OnConnectionReset) {
    this.onConnected = onConnected
    this.onConnectionReset = onConnectionReset
  }

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
    if (this.closed) {
      return null
    }
    if (this._connection) {
      return this._connection
    }
    if (this._isPending) {
      return null
    }
    try {
      this.tryConnect()
    } catch (e: any) {
      logger.error('try connect failed: ' + e.message)
    }
    return null
  }

  private tryConnect() {
    if (this._isPending) {
      return
    }
    this._isPending = true
    logger.info(`trying to connect to ${host}:${port}`)
    const client = TcpSockets.connectTLS(options, () => {
      logger.info(`successfully connected to ${host}:${port}`)
      this._isPending = false
      this.bindEvent()
      this.onConnected?.(client)
      this.setConnectFlag(false)
    })
    this.bindRetryEvent(client)
    this._connection = client
  }

  private bindRetryEvent(client: TLSSocket) {
    client.on('error', error => {
      logger.error('connect failed: ' + error)
      this._isPending = false
      this._connection?.removeAllListeners('error')
      client.destroy()
      this.setConnectFlag(true)
      if (!__DEV__) {
        setTimeout(() => {
          this.tryConnect()
        }, 8000)
      }
    })
  }

  /**
   * 关闭tcp连接.
   */
  public close() {
    const conn = this._connection
    if (!conn) {
      return
    }
    logger.info('closing Tcp connection...')
    this.closed = true
    // 避免触发自动断线重连
    conn.removeAllListeners()
    conn.destroy()
    logger.info('successfully closed Tcp connection')
  }

  /**
   * 重置连接, 当连接断开后进行重置.
   */
  public reset() {
    this._connection = null
    this._isPending = false
    this.onConnectionReset?.()
  }
}
