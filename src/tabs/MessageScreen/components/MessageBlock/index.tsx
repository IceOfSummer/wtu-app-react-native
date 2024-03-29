import React, { useRef, useState } from 'react'
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { formatTimestampSimply } from '../../../../utils/DateUtils'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import Avatar from '../../../../component/Container/Avatar'
import Button from 'react-native-button'
import {
  markMessageRead,
  markMessageUnread,
  removeMessagePanel,
} from '../../../../redux/counter/messageSlice'
import useNav from '../../../../hook/useNav'
import { CHAT_PAGE } from '../../../../router'
import { ServerUser } from '../../../../sqlite/user'
import { LastMessageQueryType } from '../../../../sqlite/last_message'
import TipPoint from '../../../../component/Container/TipPoint'

const MessageBlock: React.FC<LastMessageQueryType> = props => {
  const dispatch = useDispatch()
  const info = useSelector<ReducerTypes, ServerUser>(
    state => state.serverUser.cachedUser[props.uid]
  )
  const [showToolBox, setToolBoxVisible] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const nav = useNav()
  let nickname: string | number = props.uid
  if (info && info.nickname) {
    nickname = info.nickname
  }
  const onLongPress = ({ nativeEvent }: GestureResponderEvent) => {
    startX.current = nativeEvent.pageX
    startY.current = nativeEvent.pageY
    setToolBoxVisible(true)
  }
  const onModalTap = () => {
    setToolBoxVisible(false)
  }

  /**
   * 延迟关闭modal，瞬间关闭视觉效果不太行
   */
  function delayCloseModal() {
    setTimeout(() => {
      setToolBoxVisible(false)
    }, 100)
  }

  const onDeletePress = () => {
    setToolBoxVisible(false)
    dispatch(removeMessagePanel(props.uid))
  }

  const onPinPress = () => {
    // TODO
    setToolBoxVisible(false)
    delayCloseModal()
  }

  /**
   * 跳转聊天页面
   */
  const onPress = () => {
    nav.push(CHAT_PAGE, { uid: props.uid })
  }

  /**
   * 标记消息已读
   */
  const setReadStatus = () => {
    if (props.unreadCount === 0) {
      dispatch(markMessageUnread(props.uid))
    } else {
      dispatch(markMessageRead(props.uid))
    }
    delayCloseModal()
  }

  return (
    <View>
      <Button
        style={styles.outer}
        containerStyle={styles.container}
        onPress={onPress}
        onLongPress={onLongPress}>
        <View style={styles.msgContainer}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <Avatar uid={props.uid} />
            <View style={styles.nameMsgContainer}>
              <Text style={styles.nameText}>{nickname}</Text>
              <Text numberOfLines={1}>{props.content}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text>{formatTimestampSimply(props.createTime)}</Text>
            <TipPoint count={props.unreadCount} />
          </View>
        </View>
      </Button>
      <Modal visible={showToolBox} transparent>
        <Pressable
          onPress={onModalTap}
          style={{ width: '100%', height: '100%' }}>
          <View
            style={[
              styles.toolBox,
              { left: startX.current, top: startY.current },
            ]}>
            <View style={styles.toolBoxContainer}>
              <Button onPress={setReadStatus}>
                <Text style={styles.toolBoxButtonText}>
                  {props.unreadCount === 0 ? '标记未读' : '标记已读'}
                </Text>
              </Button>
              <Button onPress={onPinPress}>
                <Text style={styles.toolBoxButtonText}>置顶</Text>
              </Button>
              <Button onPress={onDeletePress}>
                <Text style={styles.toolBoxButtonText}>删除消息</Text>
              </Button>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.colors.boxBackgroundColor,
  },
  outer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
  },
  msgContainer: {
    paddingVertical: global.styles.$spacing_col_base,
    paddingHorizontal: global.styles.$spacing_row_lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  nameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  nameMsgContainer: {
    justifyContent: 'space-between',
    marginLeft: global.styles.$spacing_row_sm,
    flex: 1,
  },
  timeContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolBox: {
    position: 'absolute',
  },
  toolBoxContainer: {
    borderRadius: 5,
    backgroundColor: global.colors.backgroundColor,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#000',
    elevation: 3,
  },
  toolBoxButtonText: {
    color: global.colors.textColor,
    padding: 8,
  },
})

export default MessageBlock
