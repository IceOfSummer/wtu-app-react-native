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
import { ChatMessage } from '../../../../sqlite/message'
import { useDispatch, useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import config from '../../../../../config.json'
import Avatar from '../../../../component/Container/Avatar'
import Button from 'react-native-button'
import { removeMessagePanel } from '../../../../redux/counter/messageSlice'

const cdn = __DEV__ ? config.debug.cdnServer : config.release.cdnServer

const MessageBlock: React.FC<ChatMessage> = props => {
  const store = useStore<ReducerTypes>()
  const dispatch = useDispatch()
  const info = store.getState().message.relatedUser[props.sendTo]
  const [showToolBox, setToolBoxVisible] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  let nickname = 'NAME'
  if (info) {
    nickname = info.nickname
  }
  const onLongPress = ({ nativeEvent }: GestureResponderEvent) => {
    console.log(nativeEvent)
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
    console.log('delete')
    dispatch(removeMessagePanel(props.sendTo))
    delayCloseModal()
  }

  const onPinPress = () => {
    console.log('pin')
    // TODO
    setToolBoxVisible(false)
    delayCloseModal()
  }

  return (
    <View>
      <Button
        style={styles.outer}
        containerStyle={styles.container}
        onLongPress={onLongPress}>
        <View style={styles.msgContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Avatar uri={`http://${cdn}/avatar/${props.sendTo}.webp`} />
            <View style={styles.nameMsgContainer}>
              <Text style={styles.nameText}>{nickname}</Text>
              <Text>{props.content}</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text>{formatTimestampSimply(props.createTime)}</Text>
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
  },
  nameText: {
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
  nameMsgContainer: {
    justifyContent: 'space-between',
    marginLeft: global.styles.$spacing_row_sm,
  },
  timeContainer: {
    alignSelf: 'center',
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
