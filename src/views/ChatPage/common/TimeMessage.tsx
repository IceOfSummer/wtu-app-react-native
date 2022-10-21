import AbstractChatMessage from './AbstractChatMessage'
import { formatTimestampSimply } from '../../../utils/DateUtils'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/**
 * 在聊天界面上显示时间
 */
export default class TimeMessage extends AbstractChatMessage {
  public static readonly MESSAGE_TYPE = -2

  constructor(content?: string | number) {
    super(
      typeof content === 'string'
        ? content
        : formatTimestampSimply(content ? content : Date.now()),
      TimeMessage.MESSAGE_TYPE
    )
  }

  encodeMsg(): string {
    return ''
  }

  render() {
    return <TimeMessageComponent time={this.content} />
  }
}

const TimeMessageComponent: React.FC<{ time: string }> = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: global.styles.$font_size_sm,
  },
})
