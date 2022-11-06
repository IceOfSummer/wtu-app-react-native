import pubsub from 'pubsub-js'
import ChatService, { longToNumber } from './ChatService'
import { Message } from './message/Message'
import ChatResponseMessage from './message/ChatResponseMessage'
import { getLogger } from '../../utils/LoggerUtils'
import { store } from '../../redux/store'
import { insertSingleMessage } from '../../redux/counter/messageSlice'
import { MessageType } from '../../sqlite/message'

const logger = getLogger('/api/chat/MessageListener')

logger.info('started listening server message...')

let invoked = false
;(function () {
  if (invoked) {
    return
  }
  invoked = true
  pubsub.subscribe(ChatService.PUBSUB_KEY, (key, data) => {
    const m = data as Message
    if (!m || !m.getMessageType()) {
      return
    }
    if (m.getMessageType() === ChatResponseMessage.MESSAGE_TYPE) {
      // 聊天消息
      const { message } = m as ChatResponseMessage
      store.dispatch<any>(
        insertSingleMessage({
          msg: {
            uid: message.from,
            content: message.content,
            createTime: longToNumber(message.createTime),
            type: MessageType.RECEIVE,
          },
          confirm: 0,
        })
      )
      return
    }
    logger.warn(`unknown message type: ${m.getMessageType()}, content: `)
    logger.warn(m)
  })
})()

export default {}
