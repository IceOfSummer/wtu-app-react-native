import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { formatTimestamp } from '../../../../utils/DateUtils'
import { ChatMessage } from '../../../../sqlite/message'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import config from '../../../../../config.json'

const cdn = __DEV__ ? config.debug.cdnServer : config.release.cdnServer

const MessageBlock: React.FC<ChatMessage> = props => {
  const store = useStore<ReducerTypes>()
  console.log(store.getState().message)
  const info = store.getState().message.relatedUser[props.sendTo]
  let nickname
  if (info) {
    nickname = info.nickname
  }
  return (
    <View style={styles.container}>
      <FastImage
        source={{ uri: `https://${cdn}/avatar/${props.sendTo}.webp` }}
      />
      <View>
        <Text>{nickname}</Text>
        <Text>{props.content}</Text>
      </View>
      <View>
        <Text>{formatTimestamp(props.createTime)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 14,
  },
})

export default MessageBlock
