import React, { useContext } from 'react'
import { CommunityMessageQueryType } from '../../../../api/server/community'
import { StyleSheet, Text, View } from 'react-native'
import CommentItem from '../CommentItem'
import { MsgInfoContext } from '../../index'

export type Comment = CommunityMessageQueryType & {
  replyPreview?: CommunityMessageQueryType[]
}

interface CommentContainerProps {
  comments: Comment[]
  rootItem: CommunityMessageQueryType
  empty?: boolean
  onCommentPress?: (comment: Comment) => void
  loading?: boolean
  isSubPage?: boolean
}

const CommentContainer: React.FC<CommentContainerProps> = props => {
  const context = useContext(MsgInfoContext)
  return (
    <View style={styles.commentsContainer}>
      <Text style={styles.commentTitle}>评论 {props.rootItem.replyCount}</Text>
      {props.loading && props.comments.length === 0 ? (
        <Text style={global.styles.primaryTipText}>加载评论中...</Text>
      ) : null}
      {props.comments.map(value => (
        <CommentItem
          onRequireOpenMenu={() => context.openMessageMenu(value, false)}
          style={styles.comment}
          item={value}
          key={value.id}
          pid={props.rootItem.id}
          isSubPage={props.isSubPage}
        />
      ))}
      {props.empty ? (
        <Text style={[global.styles.infoTipText, { paddingVertical: 25 }]}>
          到底了哦
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  commentsContainer: {
    marginTop: 4,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  comment: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: global.colors.borderColor,
  },
  commentTitle: {
    color: global.colors.textColor,
    marginTop: 8,
    marginLeft: 10,
    fontSize: global.styles.$font_size_base,
  },
})

export default CommentContainer
