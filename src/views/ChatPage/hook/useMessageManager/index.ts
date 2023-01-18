import { useEffect, useRef, useState } from 'react'
import { queryMessage, SqliteMessage } from '../../../../sqlite/message'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
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
    loadNextPage(4).catch()
  }, [])

  /**
   * 加载消息并自动将计数器加一
   */
  function loadNextPage(size: number = 10) {
    logger.info(
      `loading message with uid ${chatWith}, current page: ${curPage.current}`
    )
    let sqliteMsg: SqliteMessage | undefined
    for (let i = messages.length - 1; i >= 0; i--) {
      sqliteMsg = messages[i].message
      if (!sqliteMsg) {
        break
      }
    }
    let minId = sqliteMsg ? sqliteMsg.messageId : 2e9
    return queryMessage(chatWith, minId, curPage.current, size)
      .then(msg => {
        logger.info(`successfully loaded ${msg.length} messages`)
        if (msg.length === 0) {
          return
        }
        const ms = msg.map(decodeMessage)
        ms.sort((a, b) => a.createTime - b.createTime)
        // 添加一条时间消息
        setMessages([new TimeMessage(msg[0].createTime), ...ms, ...messages])
        curPage.current++
      })
      .catch(e => {
        logger.error(
          `loading message with uid ${chatWith} failed! ${e.message}`
        )
        showSingleBtnTip('加载消息失败', e.message)
      })
  }

  return {
    messages,
    loadNextPage,
  }
}

export default useMessageManager
