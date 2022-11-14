import { useEffect, useRef, useState } from 'react'
import { queryMessage } from '../../../../sqlite/message'
import { quickShowErrorTip } from '../../../../native/modules/NativeDialog'
import { getLogger } from '../../../../utils/LoggerUtils'
import AbstractMessage from '../../message/AbstractMessage'
import decodeMessage from '../../message/MessageManager'
import TimeMessage from '../../message/system/TimeMessage'

const logger = getLogger('/views/ChatPage/hook/useMessageManager')

/**
 * 聊天消息管理
 * @param chatWith 和谁聊天
 */
const useMessageManager = (chatWith: number) => {
  /**
   * 当前为第几页
   */
  const curPage = useRef(0)
  const [messages, setMessages] = useState<Array<AbstractMessage>>([])
  useEffect(() => {
    loadNextPage()
  }, [])

  /**
   * 加载消息并自动将计数器加一
   */
  function loadNextPage() {
    logger.info(
      `loading message with uid ${chatWith}, current page: ${curPage.current}`
    )
    return queryMessage(chatWith, curPage.current)
      .then(msg => {
        logger.info(`successfully loaded ${msg.length} messages`)
        if (msg.length === 0) {
          return
        }
        const ms = msg.map(decodeMessage)
        // 添加一条时间消息
        ms.push(new TimeMessage(msg[0].createTime))
        setMessages(messages.concat(ms))
        curPage.current++
      })
      .catch(e => {
        logger.error(
          `loading message with uid ${chatWith} failed! ${e.message}`
        )
        quickShowErrorTip('加载消息失败', e.message)
      })
  }

  return {
    messages,
    loadNextPage,
  }
}

export default useMessageManager
