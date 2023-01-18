import React, { useEffect, useRef, useState } from 'react'
import { SpringScrollView } from 'react-native-spring-scrollview'
import useMessageManager from '../../hook/useMessageManager'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { SqliteMessage } from '../../../../sqlite/message'
import { resetCurrentTalkMessage } from '../../../../redux/counter/messageSlice'
import { LayoutChangeEvent, View } from 'react-native'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'
import SimpleLoadingHeader from '../SimpleLoadingHeader'
import { getLogger } from '../../../../utils/LoggerUtils'
import EmptyLoadingHeader from '../EmptyLoadingHeader'
import AbstractMessage from '../../message/AbstractMessage'
import NormalMessage from '../../message/chat/NormalMessage'
import NewlyMessageContainer from '../../message/component/NewlyMessageContainer'
import MessageContainer from '../../message/component/MessageContainer'

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

  // 防止初始化时显示了currentTalk的内容，最开始的时候这个值应该清空
  const ready = useRef(false)
  const previousContentHeight = useRef(0)
  // 新消息列表，id大的应该在数组的前面
  const [newlyMessage, setNewlyMessage] = useState<Array<AbstractMessage>>([])
  const pointer = useRef(0)
  const currentTalk = useSelector<ReducerTypes, Array<SqliteMessage>>(
    state => state.message.onlineMessages
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
      scr.endRefresh()
      return
    }
    logger.info('loading history message')
    loadNextPage()
      .catch(e => {
        showSingleBtnTip('加载消息失败', e.message)
      })
      .finally(() => {
        scroll.current?.endRefresh()
      })
  }

  const onHistoryMessageContainerLayout = ({
    nativeEvent,
  }: LayoutChangeEvent) => {
    if (previousContentHeight.current > 0) {
      scroll.current?.scrollTo(
        { x: 0, y: nativeEvent.layout.height - previousContentHeight.current },
        false
      )
    }
    previousContentHeight.current = nativeEvent.layout.height
  }

  const onNewMsgMeasureDone = () => {
    const scr = scroll.current!
    if (
      scr._contentHeight - scr._height - scr._contentOffset.y <=
      AUTO_TO_BOTTOM_OFFSET
    ) {
      // 回到底部
      setTimeout(() => {
        scr.scrollToEnd(true).catch(e => {
          logger.error('scroll to end failed: ' + e.message)
        })
      }, 100)
    }
  }

  // 在内容更新前的容器高度
  useEffect(() => {
    if (currentTalk.length === 0) {
      ready.current = true
    }
    if (!ready.current) {
      return
    }
    const waitingAppend: Array<AbstractMessage> = []
    for (
      let len = currentTalk.length;
      pointer.current < len;
      ++pointer.current
    ) {
      const msg = currentTalk[pointer.current]
      if (msg.uid === props.chatWith) {
        waitingAppend.push(
          new NormalMessage(AbstractMessage.removeTypeMarker(msg.content), msg)
        )
      }
    }
    if (waitingAppend.length === 0) {
      return
    }
    setNewlyMessage(newlyMessage.concat(waitingAppend))
  }, [currentTalk])

  useEffect(() => {
    // 防止消息重复加载
    dispatch(resetCurrentTalkMessage())
    if (currentTalk.length === 0) {
      ready.current = true
    }
    return () => {
      dispatch(resetCurrentTalkMessage())
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <SpringScrollView
        refreshHeader={
          loadHistoryAvailable() ? SimpleLoadingHeader : EmptyLoadingHeader
        }
        onRefresh={loadHistoryMessage}
        showsVerticalScrollIndicator
        ref={scroll}
        style={{ paddingBottom: global.styles.$spacing_col_base }}>
        <View onLayout={onHistoryMessageContainerLayout}>
          {messages.map(value => (
            <MessageContainer
              chatMessage={value.message}
              key={value.key}
              {...value.props}>
              {value.render()}
            </MessageContainer>
          ))}
        </View>
        {/*TODO 可以考虑由实现类直接提供整个消息行的渲染*/}
        {newlyMessage.map(value => (
          <NewlyMessageContainer
            onMeasureDone={onNewMsgMeasureDone}
            chatMessage={value.message}
            key={value.key}
            {...value.props}>
            {value.render()}
          </NewlyMessageContainer>
        ))}
      </SpringScrollView>
    </View>
  )
}

export default MessageArea
