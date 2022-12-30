import React, { useContext, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { getLogger } from '../../../../utils/LoggerUtils'
import {
  CommunityMessageQueryType,
  queryReply,
} from '../../../../api/server/community'
import ReplyDrawer from '../../component/ReplyDrawer'
import Toast from 'react-native-root-toast'
import LottieLoadingHeader from '../../../../component/LoadingScrollView/LottieLoadingHeader'
import { MsgInfoContext } from '../../index'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import useForceUpdate from '../../../../hook/useForceUpdate'
import RootArticleContent from '../../component/RootArticleContent'
import ArticleWrapper from '../../component/ArticleWrapper'
import CommentContainer from '../../component/CommentContainer'
import BottomReplyToolbar from '../../component/BottomReplyToolbar'

const logger = getLogger('/views/ArticleDetailPage')

export type Comment = CommunityMessageQueryType & {
  replyPreview?: CommunityMessageQueryType[]
}

const RootArticleWrapper: React.FC = () => {
  return <ArticleWrapper content={RootArticle} />
}

interface RootArticleProps {
  article: CommunityMessageQueryType
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
      logger.info('comment is loading')
      return
    }
    setLoading(true)
    try {
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
    <View style={{ height: '100%' }}>
      <SpringScrollView
        ref={scroll}
        allLoaded={empty}
        loadingFooter={LottieLoadingHeader}
        onLoading={loadComment}>
        <RootArticleContent item={item} />
        <CommentContainer
          comments={comments}
          loading={loading}
          empty={empty}
          rootItem={item}
          onCommentPress={comment =>
            replyDrawer.current?.openReplyDrawer({
              message: comment.content,
              pid: comment.id,
              replyTo: comment.id,
              replyToUserId: comment.author,
            })
          }
        />
      </SpringScrollView>
      <ReplyDrawer
        ref={replyDrawer}
        onReplySend={onReplySend}
        userInfo={userInfo}
      />
      <BottomReplyToolbar
        item={item}
        onPress={() =>
          replyDrawer.current?.openReplyDrawer({
            message: item.title,
            pid: item.id,
            replyTo: item.id,
            replyToUserId: item.author,
          })
        }
      />
    </View>
  )
}

export default RootArticleWrapper
