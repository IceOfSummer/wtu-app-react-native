import React, { useContext } from 'react'
import { Comment } from '../../route/RootArticle'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import JudgeComponent from '../JudgeComponent'
import RichTextPresentView from '../../../../component/Container/RichTextPresentView'
import CommentHeader from '../CommentHeader'
import { MsgInfoContext } from '../../index'
import { formatTimestamp } from '../../../../utils/DateUtils'

interface RootArticleContentProps {
  item: Comment
  style?: ViewStyle
}

const RootArticleContent: React.FC<RootArticleContentProps> = props => {
  const { item } = props
  const context = useContext(MsgInfoContext)

  return (
    <View style={[styles.topContainer, props.style]}>
      <Text style={styles.titleText}>{item.title}</Text>
      <CommentHeader
        item={item}
        onPress={() => context.openMessageMenu(item, true)}
      />
      <RichTextPresentView content={item.content} />
      <View style={styles.bottomContainer}>
        <Text>{formatTimestamp(item.createTime)}</Text>
        <JudgeComponent item={item} />
      </View>
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default RootArticleContent
