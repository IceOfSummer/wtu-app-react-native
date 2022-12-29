import React from 'react'
import { Comment } from '../../route/RootArticle'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'

import RowAvatar from '../../../../tabs/MessageScreen/components/RowAvatar'
import JudgeComponent from '../JudgeComponent'
import RichTextPresentView from '../../../../component/Container/RichTextPresentView'

interface RootArticleContentProps {
  item: Comment
  onPress?: (content: string) => void
  style?: ViewStyle
}

const RootArticleContent: React.FC<RootArticleContentProps> = props => {
  const { item } = props

  return (
    <Pressable
      style={[styles.topContainer, props.style]}
      onPress={() => props.onPress?.(item.title)}>
      <Text style={styles.titleText}>{item.title}</Text>
      <RowAvatar {...item} />
      <View style={styles.contentContainer}>
        <RichTextPresentView content={item.content} />
      </View>
      <JudgeComponent item={item} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: global.colors.boxBackgroundColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: global.styles.$font_size_lg,
    color: global.colors.textColor,
    marginVertical: global.styles.$spacing_col_base,
  },
  contentContainer: {
    marginVertical: 15,
    flexDirection: 'row',
  },
})

export default RootArticleContent
