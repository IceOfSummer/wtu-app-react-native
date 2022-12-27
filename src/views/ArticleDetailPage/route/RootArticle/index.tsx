import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { getLogger } from '../../../../utils/LoggerUtils'
import {
  CommunityMessageQueryType,
  queryArticleById,
  queryReply,
  queryReplyOneLevel,
} from '../../../../api/server/community'
import ReplyDrawer from '../../component/ReplyDrawer'
import Toast from 'react-native-root-toast'
import LottieLoadingHeader from '../../../../component/LoadingScrollView/LottieLoadingHeader'
import CommentItem from '../../component/CommentItem'
import { MsgInfoContext } from '../../index'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import useForceUpdate from '../../../../hook/useForceUpdate'
import EnhancedLoadingView from '../../../../component/Loading/EnhancedLoadingView'
import { UseRouteGeneric } from '../../../../router'

const logger = getLogger('/views/ArticleDetailPage')

export type Comment = CommunityMessageQueryType & {
  replyPreview?: CommunityMessageQueryType[]
}

const RootArticleWrapper: React.FC = () => {
  const { params } = useRoute<UseRouteGeneric<'ArticleDetailPage'>>()
  const [data, setData] = useState<CommunityMessageQueryType | null>(null)
  console.log(params)
  const loadPost = async () => {
    if (params.prepared) {
      return { code: 0, data: params.prepared, message: '' }
    } else if (params.manual) {
      return await queryArticleById(params.manual.rootMessageId)
    } else {
      throw new Error('消息加载失败，未传入根消息任何信息')
    }
  }

  return (
    <EnhancedLoadingView
      loadData={loadPost}
      setData={setData}
      style={{ flex: 1 }}>
      <RootArticle article={data!} isSubReply={params.isSubReply} />
    </EnhancedLoadingView>
  )
}

interface RootArticleProps {
  article: CommunityMessageQueryType
  isSubReply: boolean
}

const SIZE = 5

const RootArticle: React.FC<RootArticleProps> = props => {
  const { uidMapToNickname, msgIdMapToUser } = useContext(MsgInfoContext)
  const item = props.article
  const scroll = useRef<SpringScrollView>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(item.replyCount === 0)
  const page = useRef(1)
  const replyDrawer = useRef<ReplyDrawer>(null)
  const update = useForceUpdate()
  const userInfo = useSelector<ReducerTypes, ServerUserInfo | undefined>(
    state => state.serverUser.userInfo
  )

  function saveState(message: CommunityMessageQueryType[]) {
    message.forEach(value => {
      uidMapToNickname.set(value.author, value.nickname)
      msgIdMapToUser.set(value.id, {
        uid: value.author,
        nickname: value.nickname,
      })
    })
  }

  const loadComment = async () => {
    logger.info('started loading comment')
    if (loading) {
      logger.info('comment is loading exit!')
      return
    }
    setLoading(true)
    try {
      if (props.isSubReply) {
        // 仅加载二级评论
        const reply = await queryReplyOneLevel(item.id, page.current, SIZE)
        if (reply.data.length < SIZE) {
          setEmpty(true)
        }
        setComments(comments.concat(reply.data))
        saveState(reply.data)
        page.current++
        return
      }
      const { data } = await queryReply(item.id, page.current, SIZE)
      if (data.reply.length < SIZE) {
        setEmpty(true)
      }
      saveState(data.reply)
      saveState(data.subReply)
      // 映射一级评论
      const map = new Map<number, CommunityMessageQueryType[]>()
      data.subReply.forEach(value => {
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
      data.reply.forEach(value => {
        const replyTo = value.replyTo as number
        result.push({
          ...value,
          replyTo,
          replyPreview: map.get(value.id),
        })
      })
      setComments(comments.concat(result))
      page.current++
    } catch (e: any) {
      logger.error('load comment failed: ' + e.message)
      Toast.show('评论加载失败: ' + e.message)
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
    if (article.pid !== item.id) {
      // 回复为二级消息
      const target = comments.find(value => value.id === article.pid)
      if (target) {
        if (target.replyPreview) {
          target.replyPreview.push(article)
        } else {
          target.replyPreview = [article]
        }
        update()
        return
      }
    }
    // 直接回复根消息
    setComments([article, ...comments])
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
          {loading && comments.length === 0 ? (
            <Text style={global.styles.primaryTipText}>加载评论中...</Text>
          ) : null}
          {comments.map(value => (
            <CommentItem
              style={styles.comment}
              item={value}
              key={value.id}
              onPress={() =>
                replyDrawer.current?.openReplyDrawer({
                  message: value.content,
                  pid: props.isSubReply ? item.id : value.id,
                  replyTo: value.id,
                  replyToUserId: value.author,
                })
              }
            />
          ))}
          {empty ? (
            <Text style={global.styles.infoTipText}>到底了哦</Text>
          ) : null}
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
  container: {},
  commentArea: {
    backgroundColor: global.colors.boxBackgroundColor,
  },
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
export default RootArticleWrapper
