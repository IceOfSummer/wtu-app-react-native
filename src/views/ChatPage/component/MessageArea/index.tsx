import React, { useEffect, useRef, useState } from 'react'
import { SpringScrollView } from 'react-native-spring-scrollview'
import useMessageManager from '../../hook/useMessageManager'
import MessageContainer from '../MessageContainer'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { SqliteMessage } from '../../../../sqlite/message'
import AbstractChatMessage from '../../common/AbstractChatMessage'
import NormalMessage from '../../common/NormalMessage'
import { resetCurrentTalkMessage } from '../../../../redux/counter/messageSlice'
import { View } from 'react-native'
import { quickShowErrorTip } from '../../../../native/modules/NativeDialog'
import SimpleLoadingHeader from '../SimpleLoadingHeader'
import NewlyMessageContainer from '../NewlyMessageContainer'
import { getLogger } from '../../../../utils/LoggerUtils'
import EmptyLoadingHeader from '../EmptyLoadingHeader'

interface MessageAreaProps {
  chatWith: number
}

const logger = getLogger('views/ChatPage/component/MessageArea')

/**
 * 如果当前滚动条位置低于该值，在接收到新消息后会自动滑动到最底部
 */
const AUTO_TO_BOTTOM_OFFSET = 5

const MessageArea: React.FC<MessageAreaProps> = props => {
  const { messages, loadNextPage } = useMessageManager(props.chatWith)
  const scroll = useRef<SpringScrollView>(null)

  // current message
  const [newlyMessage, setNewlyMessage] = useState<Array<AbstractChatMessage>>(
    []
  )
  const pointer = useRef(0)
  const currentTalk = useSelector<ReducerTypes, Array<SqliteMessage>>(
    state => state.message.currentTalkMessages
  )
  const dispatch = useDispatch()

  /**
   * 当前是否可以加载历史消息
   */
  function loadHistoryAvailable() {
    return scroll.current
      ? scroll.current._contentHeight >= scroll.current._height
      : false
  }

  /**
   * 下拉回调，加载更多历史消息
   */
  const loadHistoryMessage = () => {
    const scr = scroll.current
    if (!scr) {
      return
    }
    if (!loadHistoryAvailable()) {
      // 防止高度不够触发了下拉刷新
      scr.endLoading(true)
      return
    }
    logger.info('loading history message')
    loadNextPage()
      .catch(e => {
        quickShowErrorTip('加载消息失败', e.message)
      })
      .finally(() => {
        scroll.current?.endLoading(true)
      })
  }

  /**
   * 防止底部插入消息造成视觉上的消息"被顶上去了"
   *
   * 同时如果用户当前滚动条在最底部，提供滑动入场的视觉效果
   */
  const onNewMsgMeasureDone = (height: number, show: () => void) => {
    const scr = scroll.current!
    show()
    scr
      .scrollTo(
        {
          x: 0,
          y: scr._contentOffset.y + height,
        },
        false
      )
      .then(() => {
        if (scr._contentOffset.y <= AUTO_TO_BOTTOM_OFFSET) {
          // 回到底部(这里滚动条被反转了)
          scr.scrollToBegin(true).catch(e => {
            logger.error('scroll to begin failed: ' + e.message)
          })
        }
      })
      .catch(e => {
        logger.error(
          'callback "onNewMsgMeasureDone" occurs error: ' + e.message
        )
      })
  }

  // 在内容更新前的容器高度
  useEffect(() => {
    const waitingAppend: Array<AbstractChatMessage> = []
    for (
      let len = currentTalk.length;
      pointer.current < len;
      ++pointer.current
    ) {
      const msg = currentTalk[pointer.current]
      if (msg.uid === props.chatWith) {
        waitingAppend.push(
          new NormalMessage(
            AbstractChatMessage.removeTypeMarker(msg.content),
            msg
          )
        )
      }
    }
    if (waitingAppend.length) {
      setNewlyMessage(waitingAppend.concat(newlyMessage))
    }
  }, [currentTalk])

  useEffect(() => {
    return () => {
      dispatch(resetCurrentTalkMessage())
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <SpringScrollView
        loadingFooter={
          loadHistoryAvailable() ? SimpleLoadingHeader : EmptyLoadingHeader
        }
        onLoading={loadHistoryMessage}
        showsVerticalScrollIndicator
        inverted
        ref={scroll}
        style={{ paddingBottom: global.styles.$spacing_col_base }}>
        {newlyMessage.map(value => (
          <NewlyMessageContainer
            onMeasureDone={onNewMsgMeasureDone}
            chatMessage={value.chatMessage}
            key={value.key}
            hideContainer={value.hideAvatar}>
            {value.render()}
          </NewlyMessageContainer>
        ))}
        {messages.map(value => (
          <MessageContainer
            chatMessage={value.chatMessage}
            key={value.key}
            hideContainer={value.hideAvatar}>
            {value.render()}
          </MessageContainer>
        ))}
      </SpringScrollView>
    </View>
  )
}

export default MessageArea
