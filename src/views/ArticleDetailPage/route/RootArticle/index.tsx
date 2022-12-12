import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { getLogger } from '../../../../utils/LoggerUtils'
import {
  CommunityMessageQueryType,
  queryReply,
  querySubReplyPreview,
} from '../../../../api/server/community'
import ReplyDrawer from '../../component/ReplyDrawer'
import Toast from 'react-native-root-toast'
import LottieLoadingHeader from '../../../../component/LoadingScrollView/LottieLoadingHeader'
import CommentItem from '../../component/CommentItem'
import { ArticleDetailRouteParam, MsgInfoContext } from '../../index'
import CenterLoadingIndicator from '../../../../component/EnhancedScrollView/CenterLoadingIndicator'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'

const logger = getLogger('/views/ArticleDetailPage')

export type Comment = CommunityMessageQueryType & {
  replyPreview?: CommunityMessageQueryType[]
}

const PAGE_SIZE = 5

const RootArticle: React.FC = () => {
  const { uidMapToNickname, msgIdMapToUser } = useContext(MsgInfoContext)
  const route = useRoute()
  const item = route.params as ArticleDetailRouteParam
  const scroll = useRef<SpringScrollView>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(item.replyCount === 0)
  const page = useRef(1)
  const replyDrawer = useRef<ReplyDrawer>(null)
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )

  const loadComment = async () => {
    if (item.replyTo === 0) {
      logger.info('no reply available')
      return
    }
    logger.info('started loading comment')
    if (loading) {
      logger.info('comment is loading exit!')
      return
    }
    setLoading(true)
    let reply: CommunityMessageQueryType[] | undefined
    try {
      reply = (await queryReply(item.id, page.current, PAGE_SIZE)).data
      logger.info('query reply success, length: ' + reply.length)
      logger.debug(reply)
      page.current++
      if (reply.length < PAGE_SIZE) {
        setEmpty(true)
      }
      // 加载评论预览(二级评论)
      if (item.isSubReply) {
        setComments(comments.concat(reply))
        return
      }
      let pids = ''
      for (let i = 0, len = reply.length; i < len; i++) {
        const r = reply[i]
        uidMapToNickname.set(r.author, r.nickname)
        msgIdMapToUser.set(r.id, { uid: r.author, nickname: r.nickname })
        if (r.replyCount > 0) {
          // 有回复才去查
          pids += r.id
          if (i < len - 1) {
            pids += ','
          }
        }
      }
      logger.debug('pids: ' + pids)
      if (!pids) {
        setComments(comments.concat(reply))
        return
      }
      const { data: subReply } = await querySubReplyPreview(pids)
      logger.info('query sub reply success!')
      logger.debug(subReply)
      // 映射一级评论
      const map = new Map<number, CommunityMessageQueryType[]>()
      subReply.forEach(value => {
        uidMapToNickname.set(value.author, value.nickname)
        msgIdMapToUser.set(value.id, {
          uid: value.author,
          nickname: value.nickname,
        })
        const arr = map.get(value.pid)
        if (arr) {
          arr.push(value)
        } else {
          map.set(value.pid, [value])
        }
      })
      const result: Comment[] = []
      reply.forEach(value => {
        const replyTo = value.replyTo as number
        result.push({
          ...value,
          replyTo,
          replyPreview: map.get(value.id),
        })
      })
      setComments(comments.concat(result))
    } catch (e: any) {
      logger.error('load comment failed: ' + e.message)
      if (reply) {
        setComments(comments.concat(reply))
        Toast.show('二级评论加载失败: ' + e.message)
      } else {
        Toast.show('评论加载失败: ' + e.message)
      }
    } finally {
      scroll.current?.endLoading(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    uidMapToNickname.set(item.author, item.nickname)
    msgIdMapToUser.set(item.id, { uid: item.author, nickname: item.nickname })
    loadComment().then()
  }, [])

  const onReplySend = (article: CommunityMessageQueryType) => {
    setComments(comments.concat(article))
  }

  return (
    <View style={styles.container}>
      <SpringScrollView
        ref={scroll}
        allLoaded={empty}
        loadingFooter={LottieLoadingHeader}
        onLoading={loadComment}>
        <CommentItem
          item={item}
          onPress={() =>
            replyDrawer.current?.openReplyDrawer({
              message: item.content,
              pid: item.id,
              replyTo: item.id,
              replyToUserId: item.author,
            })
          }
        />
        <View style={styles.commentsContainer}>
          <Text style={styles.commentTitle}>评论 {item.replyCount}</Text>
          <SpringScrollView
            onLoading={loadComment}
            allLoaded={empty}
            loadingFooter={LottieLoadingHeader}>
            {comments.length === 0 && loading ? (
              <CenterLoadingIndicator
                backgroundColor={global.colors.boxBackgroundColor}
              />
            ) : null}
            {comments.map(value => (
              <CommentItem
                style={styles.comment}
                item={value}
                key={value.id}
                onPress={() =>
                  replyDrawer.current?.openReplyDrawer({
                    message: value.content,
                    pid: item.isSubReply ? item.id : value.id,
                    replyTo: value.id,
                    replyToUserId: value.author,
                  })
                }
              />
            ))}
            {empty ? (
              <Text style={global.styles.infoTipText}>到底了哦</Text>
            ) : null}
          </SpringScrollView>
        </View>
      </SpringScrollView>
      <ReplyDrawer
        ref={replyDrawer}
        onReplySend={onReplySend}
        userInfo={userInfo}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  commentArea: {
    backgroundColor: global.colors.boxBackgroundColor,
  },
  commentsContainer: {
    marginTop: 4,
    backgroundColor: global.colors.boxBackgroundColor,
    flex: 1,
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
export default RootArticle
