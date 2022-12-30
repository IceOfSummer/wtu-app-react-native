import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  CommunityMessageQueryType,
  queryReplyOneLevel,
} from '../../../../api/server/community'
import { View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { MsgInfoContext } from '../../index'
import ReplyDrawer from '../../component/ReplyDrawer'
import { useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { ServerUserInfo } from '../../../../redux/types/serverUserTypes'
import { Comment } from '../RootArticle'
import LottieLoadingHeader from '../../../../component/LoadingScrollView/LottieLoadingHeader'
import { getLogger } from '../../../../utils/LoggerUtils'
import Toast from 'react-native-root-toast'
import ArticleWrapper from '../../component/ArticleWrapper'
import CommentItem from '../../component/CommentItem'
import CommentContainer from '../../component/CommentContainer'

const logger = getLogger('/views/ArticleDetailPage/route/SubReplyDetail')

interface SubReplyDetailProps {
  article: CommunityMessageQueryType
}

const SIZE = 5

/**
 * 根消息为一级级评论时使用的页面
 * @constructor
 */
const SubReplyDetail: React.FC<SubReplyDetailProps> = props => {
  const { uidMapToNickname, msgIdMapToUser } = useContext(MsgInfoContext)
  const item = props.article
  const scroll = useRef<SpringScrollView>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(item.replyCount === 0)
  const page = useRef(1)
  const replyDrawer = useRef<ReplyDrawer>(null)
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
    logger.info('started loading sub comment')
    if (loading) {
      logger.info('comment is loading')
      return
    }
    setLoading(true)
    let reply: CommunityMessageQueryType[]
    try {
      reply = (await queryReplyOneLevel(item.id, page.current, SIZE)).data
    } catch (e: any) {
      logger.error('load sub comment failed: ' + e.message)
      Toast.show('加载评论失败: ' + e.message)
      return
    }
    if (reply.length < SIZE) {
      setEmpty(true)
    }
    setComments(comments.concat(reply))
    saveState(reply)
    page.current++
  }

  useEffect(() => {
    uidMapToNickname.set(item.author, item.nickname)
    msgIdMapToUser.set(item.id, { uid: item.author, nickname: item.nickname })
    loadComment().then()
  }, [])

  const onReplySend = (article: CommunityMessageQueryType) => {
    setComments([article, ...comments])
  }

  return (
    <View style={{ height: '100%' }}>
      <SpringScrollView
        ref={scroll}
        allLoaded={empty}
        loadingFooter={LottieLoadingHeader}>
        <CommentItem
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
        <CommentContainer
          comments={comments}
          rootItem={item}
          loading={loading}
          empty={empty}
          onCommentPress={comment =>
            replyDrawer.current?.openReplyDrawer({
              message: comment.content,
              pid: item.id,
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
    </View>
  )
}

const SubReplyDetailWrapper = () => {
  return <ArticleWrapper content={SubReplyDetail} />
}

export default SubReplyDetailWrapper
