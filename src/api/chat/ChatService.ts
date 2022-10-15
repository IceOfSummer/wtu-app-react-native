import TcpSockets from 'react-native-tcp-socket'
import Socket, {
  ConnectionOptions,
} from 'react-native-tcp-socket/lib/types/Socket'
import { buildMessage, Message } from './message/Message'

const options: ConnectionOptions = {
  port: 7000,
  host: '10.181.156.93',
}
interface EventCallback {
  id: number
  message?: string
}
export default class ChatService {
  private static tcpClient: Socket | null = null

  public static connect() {
    return new Promise<boolean>(resolve => {
      if (ChatService.tcpClient != null) {
        resolve(true)
        return
      }
      ChatService.tcpClient = TcpSockets.createConnection(options, () => {
        resolve(true)
      })
      ChatService.tcpClient?.setEncoding('utf-8')
    })
  }

  public static sendMessage(message: Message): Promise<EventCallback> {
    return new Promise<EventCallback>((resolve, reject) => {
      const { tcpClient } = ChatService
      if (!tcpClient) {
        reject({
          id: 1,
          message: '连接服务器失败, 请重试',
        })
        return
      }
      if (tcpClient.write(buildMessage(message))) {
        resolve({
          id: 1,
        })
      } else {
        reject({
          id: 1,
        })
      }
    })
  }
}
