import React from 'react'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import MessageBlock from '../../components/MessageBlock'
import { MessageLabel } from '../../../../redux/types/messageTypes'
import { StyleSheet, Text, View } from 'react-native'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'
import Empty from '../../../../component/Container/Empty'

const Chat: React.FC = () => {
  const lastMsg = useSelector<ReducerTypes, MessageLabel>(
    state => state.message.messageLabels
  )
  const ent = Object.entries(lastMsg)

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>聊天消息</Text>
      </View>
      <View>
        {ent.map(([key, value]) =>
          value ? <MessageBlock {...value} key={key} /> : null
        )}
      </View>
      <ConditionHideContainer hide={ent.length > 0}>
        <Empty name="暂时没有新消息" />
      </ConditionHideContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    marginTop: 15,
  },
  headerText: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: global.colors.borderColor,
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_base,
  },
})

export default Chat
