import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import Button from 'react-native-button'
import { ImService } from '../../../../api/chat/ImService'
import { getLogger } from '../../../../utils/LoggerUtils'
import Toast from 'react-native-root-toast'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'

const logger = getLogger('/views/ChatPage/component/ToolBar')
interface ToolBarProps {
  styles?: ViewStyle
  talkingTo: number
}

/**
 * 聊天界面底部工具栏
 */
const ToolBar: React.FC<ToolBarProps> = props => {
  const [text, setText] = useState('')

  const sendMessage = () => {
    logger.info('send message: ' + text)
    ImService.INSTANCE.sendChatMessage(props.talkingTo, text).catch(e => {
      logger.error('send message failed: ' + e.message)
      Toast.show('发送失败: ' + e.message)
    })
    setText('')
  }
  return (
    <View style={[props.styles, styles.container]}>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={setText}
          maxLength={300}
          value={text}
          selectionColor={global.colors.primaryColor}
        />
      </View>
      <ConditionHideContainer hide={text.length === 0}>
        <Button
          style={styles.button}
          containerStyle={styles.buttonContainer}
          onPress={sendMessage}>
          <View style={styles.buttonInnerContainer}>
            <Text style={styles.buttonText}>发送</Text>
          </View>
        </Button>
      </ConditionHideContainer>
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
    flex: 1,
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
