import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import Button from 'react-native-button'
import ChatService from '../../../../api/chat/ChatService'
import ChatRequestMessage from '../../../../api/chat/message/ChatRequestMessage'
import { useDispatch } from 'react-redux'
import { insertSingleMessage } from '../../../../redux/counter/messageSlice'
import { MessageType } from '../../../../sqlite/message'
import NormalMessage from '../../common/NormalMessage'
import { appendMessagePrefix } from '../../common/MessageManager'

interface ToolBarProps {
  styles?: ViewStyle
  talkingTo: number
}

/**
 * 聊天界面底部工具栏
 */
const ToolBar: React.FC<ToolBarProps> = props => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const sendMessage = () => {
    const content = text
    setText('')
    ChatService.instance
      .sendMessage(new ChatRequestMessage(props.talkingTo, text))
      .then(msg => {
        if (!msg.success || !msg.data) {
          return
        }
        dispatch(
          insertSingleMessage({
            msg: {
              uid: props.talkingTo,
              type: MessageType.SEND,
              messageId: Number.parseInt(msg.data, 10),
              content: appendMessagePrefix(NormalMessage.MESSAGE_TYPE, content),
              createTime: Date.now(),
            },
            confirm: 1,
          })
        )
      })
      .catch(e => {
        console.error(e)
      })
  }
  return (
    <View style={[props.styles, styles.container]}>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={setText}
          value={text}
          selectionColor={global.colors.primaryColor}
        />
      </View>
      <Button
        style={styles.button}
        containerStyle={styles.buttonContainer}
        onPress={sendMessage}>
        <View style={styles.buttonInnerContainer}>
          <Text style={styles.buttonText}>发送</Text>
        </View>
      </Button>
    </View>
  )
}

const COMPONENT_HEIGHT = 35

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: global.colors.shallowBoxBackgroundColor,
  },
  textInput: {
    marginLeft: 6,
    height: COMPONENT_HEIGHT + 4,
  },
  textInputContainer: {
    width: '85%',
    backgroundColor: global.colors.boxBackgroundColor,
    borderRadius: 22,
    height: COMPONENT_HEIGHT,
    justifyContent: 'center',
  },
  button: {
    width: '18%',
  },
  buttonContainer: {
    backgroundColor: global.colors.primaryColor,
    height: COMPONENT_HEIGHT,
    overflow: 'hidden',
    borderRadius: 22,
  },
  buttonInnerContainer: {
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: '#fff',
  },
})
export default ToolBar
