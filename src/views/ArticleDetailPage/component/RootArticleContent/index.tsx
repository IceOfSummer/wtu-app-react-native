import React from 'react'
import { Comment } from '../../route/RootArticle'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import RowAvatar from '../../../../tabs/MessageScreen/components/RowAvatar'
import JudgeComponent from '../JudgeComponent'
import RichTextPresentView from '../../../../component/Container/RichTextPresentView'

interface RootArticleContentProps {
  item: Comment
  style?: ViewStyle
}

const RootArticleContent: React.FC<RootArticleContentProps> = props => {
  const { item } = props

  return (
    <View style={[styles.topContainer, props.style]}>
      <Text style={styles.titleText}>{item.title}</Text>
      <RowAvatar {...item} />
      <RichTextPresentView content={item.content} />
      <JudgeComponent item={item} />
    </View>
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
  },
})

export default RootArticleContent
