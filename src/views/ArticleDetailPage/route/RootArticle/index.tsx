import React, { useContext, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { getLogger } from '../../../../utils/LoggerUtils'
import {
  CommunityMessageQueryType,
  queryReply,
} from '../../../../api/server/community'
import Toast from 'react-native-root-toast'
import LottieLoadingHeader from '../../../../component/LoadingScrollView/LottieLoadingHeader'
import { MsgInfoContext } from '../../index'
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
  const item = props.article

  const context = useContext(MsgInfoContext)

  const { comments, setComments } = context
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(item.replyCount === 0)

  const scroll = useRef<SpringScrollView>(null)
  const page = useRef(1)

  function saveState(message: CommunityMessageQueryType[]) {
    message.forEach(value => {
      context.uidMapToNickname.set(value.author, value.nickname)
      context.msgIdMapToUser.set(value.id, {
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
        context.uidMapToNickname.set(value.author, value.nickname)
        context.msgIdMapToUser.set(value.id, {
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
    context.uidMapToNickname.set(item.author, item.nickname)
    context.msgIdMapToUser.set(item.id, {
      uid: item.author,
      nickname: item.nickname,
    })
    loadComment().then()
  }, [])

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
        />
      </SpringScrollView>
      <BottomReplyToolbar
        item={item}
        onPress={() =>
          context.openReplyDrawer({
            message: item.title,
            pid: item.id,
            replyTo: item.id,
            replyToUserId: item.author,
            isSubReplyPage: false,
          })
        }
      />
    </View>
  )
}

export default RootArticleWrapper
