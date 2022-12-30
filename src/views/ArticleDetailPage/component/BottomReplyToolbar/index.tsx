import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CommunityMessageQueryType } from '../../../../api/server/community'
import JudgeComponent from '../JudgeComponent'

interface BottomReplyToolbarProps {
  onPress?: () => void
  item: CommunityMessageQueryType
}

const BottomReplyToolbar: React.FC<BottomReplyToolbarProps> = props => {
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>留下你的评论</Text>
      </View>
      <JudgeComponent item={props.item} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: global.colors.boxBackgroundColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: global.colors.borderColor,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: global.colors.shallowBoxBackgroundColor,
    borderRadius: 15,
    flex: 1,
    paddingHorizontal: 10,
    marginEnd: 10,
  },
  text: {
    paddingVertical: 8,
  },
})

export default BottomReplyToolbar
