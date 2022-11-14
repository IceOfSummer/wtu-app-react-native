import AbstractSystemMessage from '../AbstractSystemMessage'
import { formatTimestampSimply } from '../../../../utils/DateUtils'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class TimeMessage extends AbstractSystemMessage {
  public constructor(time?: string | number) {
    super(
      typeof time === 'string'
        ? time
        : formatTimestampSimply(time ? time : Date.now())
    )
  }

  render(): React.ReactNode {
    return <TimeMessageComponent time={this.decodedContent} />
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
