import React, { useContext } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
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
import Toast from 'react-native-root-toast'
import CommentHeader from '../CommentHeader'
import { formatTimestamp } from '../../../../utils/DateUtils'

interface CommentItemProps {
  item: Comment
  pid: number
  style?: ViewStyle
  onRequireOpenMenu?: (comment: Comment) => void
  isSubPage?: boolean
}

const CommentItem: React.FC<CommentItemProps> = props => {
  const context = useContext(MsgInfoContext)
  const { item } = props
  const subReply: CommunityMessageQueryType[] = item.replyPreview ?? []
  const nav = useNavigation<NavigationProp<ArticleDetailRouteType>>()
  const replyTo = item.replyTo ?? item.pid
  const toSubReplyDetail = () => {
    const copy = { ...item }
    copy.replyPreview = undefined
    nav.navigate(COMMENT_DETAIL_PAGE, { isSubReply: true, prepared: copy })
  }

  let contentPrefix: string | undefined
  if (item.replyTo !== item.pid) {
    const user = context.msgIdMapToUser.get(replyTo)
    contentPrefix = user ? user.nickname : context.uidMapToNickname.get(replyTo)
  }

  const copyContentToClipboard = () => {
    Clipboard.setString(item.content)
    Toast.show(`已复制${item.nickname}的评论`)
  }

  const openReplyDrawer = () => {
    if (props.isSubPage) {
      context.openReplyDrawer({
        message: item.content,
        pid: props.pid,
        replyTo: item.id,
        replyToUserId: item.author,
        isSubReplyPage: true,
      })
    } else {
      context.openReplyDrawer({
        message: item.content,
        pid: item.id,
        replyTo: item.id,
        replyToUserId: item.author,
        isSubReplyPage: false,
      })
    }
  }

  return (
    <Pressable
      onLongPress={copyContentToClipboard}
      style={[styles.topContainer, props.style]}
      onPress={openReplyDrawer}>
      {item.title ? <Text style={styles.titleText}>{item.title}</Text> : null}
      <CommentHeader item={item} onPress={props.onRequireOpenMenu} />
      <View style={styles.contentContainer}>
        <Text>
          {contentPrefix ? (
            <Text style={{ color: global.colors.textColor }}>
              <Text style={styles.name}>回复@{contentPrefix}: </Text>
            </Text>
          ) : null}
          <Text style={styles.content}>{item.content}</Text>
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text>{formatTimestamp(item.createTime)}</Text>
        <JudgeComponent item={item} />
      </View>
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default CommentItem
