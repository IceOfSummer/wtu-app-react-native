import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  CommunityMessageQueryType,
  queryReplyOneLevel,
} from '../../../../api/server/community'
import { View } from 'react-native'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { MsgInfoContext } from '../../index'
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
  const item = props.article

  const context = useContext(MsgInfoContext)

  const { subComments, setSubComments } = context
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(item.replyCount === 0)
  const page = useRef(1)

  const scroll = useRef<SpringScrollView>(null)

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
    setSubComments(subComments.concat(reply))
    saveState(reply)
    page.current++
  }

  useEffect(() => {
    context.uidMapToNickname.set(item.author, item.nickname)
    context.msgIdMapToUser.set(item.id, {
      uid: item.author,
      nickname: item.nickname,
    })
    loadComment().then()
    return () => {
      context.setSubComments([])
    }
  }, [])

  return (
    <View style={{ height: '100%' }}>
      <SpringScrollView
        ref={scroll}
        allLoaded={empty}
        loadingFooter={LottieLoadingHeader}>
        <CommentItem
          onRequireOpenMenu={() => context.openMessageMenu(item, true)}
          item={item}
          pid={item.id}
          isSubPage
        />
        <CommentContainer
          comments={subComments}
          rootItem={item}
          loading={loading}
          isSubPage
          empty={empty}
        />
      </SpringScrollView>
    </View>
  )
}

const SubReplyDetailWrapper = () => {
  return <ArticleWrapper content={SubReplyDetail} />
}

export default SubReplyDetailWrapper
