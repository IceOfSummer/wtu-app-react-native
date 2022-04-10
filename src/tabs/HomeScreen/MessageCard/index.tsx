import React from 'react'
import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native'
import Icons from '../../../component/Icons'

interface MessageCardProps {
  title: string
  message?: string
  onPress?: () => void
  backgroundColor?: ColorValue
  titleColor?: ColorValue
  messageColor?: ColorValue
}

const MessageCard: React.FC<MessageCardProps> = props => {
  const titleColor = props.titleColor ? props.titleColor : '#fff'
  const messageColor = props.messageColor ? props.messageColor : '#fff'
  return (
    <View style={styles.cardOuter}>
      <Pressable
        onPress={props.onPress}
        style={[
          styles.messageCardContainer,
          { backgroundColor: props.backgroundColor },
        ]}>
        <View>
          <Text style={[styles.titleText, { color: titleColor }]}>
            {props.title}
          </Text>
          <Text style={[styles.messageText, { color: messageColor }]}>
            {props.message}
          </Text>
        </View>
        <View>
          <Icons iconText="&#xe61c;" size={35} color="#fff" />
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  messageCardContainer: {
    borderRadius: 8,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: global.styles.$font_size_base,
  },
  messageText: {
    fontSize: global.styles.$font_size_sm,
    marginTop: global.styles.$spacing_col_sm,
  },
})

export default MessageCard
