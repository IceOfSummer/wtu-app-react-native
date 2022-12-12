import React, { useContext } from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import RowAvatar from '../../../../tabs/MessageScreen/components/RowAvatar'
import JudgeComponent from '../JudgeComponent'
import {
  ArticleDetailRouteType,
  COMMENT_DETAIL_PAGE,
  MsgInfoContext,
} from '../../index'
import { CommunityMessageQueryType } from '../../../../api/server/community'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/src/types'
import { Comment } from '../../route/RootArticle'

interface CommentItemProps {
  item: Comment
  onPress?: () => void
  style?: ViewStyle
}

const CommentItem: React.FC<CommentItemProps> = props => {
  const { uidMapToNickname, msgIdMapToUser } = useContext(MsgInfoContext)
  const { item } = props
  const subReply: CommunityMessageQueryType[] = item.replyPreview ?? []
  const nav = useNavigation<NavigationProp<ArticleDetailRouteType>>()
  const replyTo = item.replyTo ?? item.pid
  const toSubReplyDetail = () => {
    const copy = { ...item }
    copy.replyPreview = undefined
    nav.navigate(COMMENT_DETAIL_PAGE, { ...copy, isSubReply: true })
  }

  let contentPrefix: string | undefined
  if (item.replyTo !== item.pid) {
    const user = msgIdMapToUser.get(replyTo)
    contentPrefix = user ? user.nickname : uidMapToNickname.get(replyTo)
  }
  return (
    <Pressable
      style={[styles.topContainer, props.style]}
      onPress={props.onPress}>
      {item.title ? <Text style={styles.titleText}>{item.title}</Text> : null}
      <RowAvatar {...item} />
      <View style={styles.contentContainer}>
        {contentPrefix ? (
          <Text style={{ color: global.colors.textColor }}>
            <Text style={styles.name}>回复@{contentPrefix}: </Text>
          </Text>
        ) : null}
        <Text style={styles.content}>{item.content}</Text>
      </View>
      <JudgeComponent item={item} />
      {subReply.length === 0 ? null : (
        <View style={styles.replyContainer}>
          <Pressable onPress={toSubReplyDetail}>
            {subReply.map(value => (
              <SubReply
                rootCommentUid={item.author}
                item={value}
                key={value.id}
              />
            ))}
          </Pressable>
        </View>
      )}
    </Pressable>
  )
}

interface SubReplyProps {
  item: CommunityMessageQueryType
  rootCommentUid: number
}

const SubReply: React.FC<SubReplyProps> = props => {
  const { uidMapToNickname, msgIdMapToUser } = useContext(MsgInfoContext)
  const { item } = props
  const senderName = uidMapToNickname.get(item.author) ?? item.id
  const replyTo = item.replyTo ?? item.pid
  let replyToText: string | number
  if (item.replyTo === item.pid) {
    replyToText = ''
  } else {
    const user = msgIdMapToUser.get(replyTo)
    replyToText = user ? user.nickname : uidMapToNickname.get(replyTo) ?? ''
  }

  return (
    <View>
      <Text numberOfLines={3}>
        <Text style={styles.name}>{senderName}</Text>
        <Text style={{ color: global.colors.textColor }}>
          {replyToText ? '@' : ''}
        </Text>
        <Text style={styles.name}>{replyToText}</Text>: {item.content}
      </Text>
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
    flexDirection: 'row',
  },
  content: {
    color: global.colors.textColor,
  },
  replyContainer: {
    marginTop: 10,
    backgroundColor: global.colors.shallowBoxBackgroundColor,
    padding: 10,
    borderRadius: 6,
  },
  name: {
    color: global.colors.primaryColor,
  },
})

export default CommentItem
