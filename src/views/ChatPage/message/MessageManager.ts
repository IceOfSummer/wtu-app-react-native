import { getLogger } from '../../../utils/LoggerUtils'
import { SqliteMessage } from '../../../sqlite/message'
import NormalMessage, { normalMessageFactory } from './chat/NormalMessage'
import AbstractMessage, { ChatMessageFactory } from './AbstractMessage'

const logger = getLogger('views/ChatPage/common/MessageManager')

const messageFactoryMapping: Array<ChatMessageFactory> = []
messageFactoryMapping[NormalMessage.MESSAGE_TYPE] = normalMessageFactory

/**
 * 特殊分隔符
 *
 * ~~来源于Minecraft~~
 */
const splitter = '§'
const MAX_TYPE_WIDTH = 4

/**
 * 解析消息并返回<b>React组件</b>
 * @param msg 消息内容
 */
const decodeMessage = (msg: SqliteMessage): AbstractMessage => {
  const { content } = msg
  logger.debug(`parsing content: ${content}`)
  try {
    return unsafeParseMessage(msg)
  } catch (e: any) {
    logger.error(
      'parse message error: ' + e.message + '. origin message: ' + content
    )
    return new NormalMessage(content, msg)
  }
}

const unsafeParseMessage = (msg: SqliteMessage): AbstractMessage => {
  const { content } = msg
  if (content.charAt(0) !== splitter) {
    logger.warn('invalid message type, origin content: ' + content)
    return new NormalMessage(content, msg)
  }
  let messageType = 0
  let i = 1
  // get message type
  for (let len = content.length; i < len && i <= MAX_TYPE_WIDTH; ++i) {
    const cur = content.charAt(i)
    if (cur === splitter) {
      break
    }
    const num = Number.parseInt(cur, 10)
    if (isNaN(num)) {
      break
    }
    messageType = messageType * 10 + num
  }
  // 防止i停在分隔符上
  if (content.charAt(i) === splitter) {
    i++
  }
  const factory = messageFactoryMapping[messageType]
  if (factory) {
    return factory(content.substring(i), msg)
  }
  logger.warn(
    'unknown message type: ' + messageType + 'origin content: ' + content
  )
  return new NormalMessage(content, msg)
}

export const encodeContent = (messageType: number, content: string): string => {
  return splitter + messageType + splitter + content
}
export default decodeMessage
