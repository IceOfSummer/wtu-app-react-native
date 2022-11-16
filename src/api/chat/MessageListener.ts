/**
 * 用于管理服务器主动的消息推送
 */
import pubsub from 'pubsub-js'
import ImTemplate from './ImTemplate'
import { Message } from './message/Message'
import ChatResponseMessage from './message/response/ChatResponseMessage'
import { getLogger } from '../../utils/LoggerUtils'
import { store } from '../../redux/store'
import { insertSingleMessage } from '../../redux/counter/messageSlice'
import { MessageType } from '../../sqlite/message'
import { ImService } from './ImService'

const logger = getLogger('/api/chat/MessageListener')

let invoked = false
;(function () {
  if (invoked) {
    return
  }
  invoked = true
  pubsub.subscribe(ImTemplate.PUBSUB_KEY, (key, data) => {
    const m = data as Message
    if (!m || !m.messageType) {
      return
    }
    if (m.messageType === ChatResponseMessage.MESSAGE_TYPE) {
      // 聊天消息
      const { message } = m as ChatResponseMessage
      store.dispatch<any>(
        insertSingleMessage({
          msg: {
            uid: message.from,
            messageId: message.msgId,
            content: message.content,
            createTime: message.createTime * 1000,
            type: MessageType.RECEIVE,
          },
          confirm: 0,
        })
      )
      ImService.INSTANCE.updateMsgId(message.msgId)
      return
    }
    logger.warn(`unknown message type: ${m.messageType}, content: `)
    logger.warn(m)
  })
})()

export default {}
