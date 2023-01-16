import { serverNoRepeatAjax } from '../../request'

type CommunityMessage = {
  id: number
  pid: number
  author: number
  title: string
  content: string
  createTime: number
  like: number
  dislike: number
  replyTo?: number
  replyCount: number
  contentPreview: string
}

export type PostArticleType = {
  /**
   * 父评论的id，为0时表示没有父消息
   */
  pid: number
  title?: string
  content: string
  replyTo?: number
  contentPreview: string
}

export type PostReply = {
  reply: CommunityMessageQueryType[]
  subReply: CommunityMessageQueryType[]
}

export type CommunityMessageQueryType = CommunityMessage & {
  nickname: string
}

type CommunityMessagePost = CommunityMessageQueryType
export const postArticle = (
  post: PostArticleType,
  enableNotification?: boolean
) =>
  serverNoRepeatAjax<number>(
    '/community/post',
    { ...post, n: enableNotification ? '1' : undefined },
    'POST'
  )

export const queryNewlyCommunityMessage = (param: {
  maxId?: number
  minId?: number
}) =>
  serverNoRepeatAjax<CommunityMessageQueryType[]>('/community/newly_message', {
    mi: param.minId,
    mx: param.maxId,
  })

/**
 * 获取评论，只会获取一级或二级的评论
 */
export const queryReplyOneLevel = (pid: number, page = 1, size = 5) =>
  serverNoRepeatAjax<CommunityMessageQueryType[]>(
    `/community/article/${pid}/reply/level`,
    {
      pi: pid,
      p: page,
      s: size,
    }
  )

export const queryReply = (messageId: number, page = 1, size?: number) =>
  serverNoRepeatAjax<PostReply>(`/community/article/${messageId}/reply`, {
    p: page,
    s: size,
  })

export const queryArticleById = (id: number) =>
  serverNoRepeatAjax<CommunityMessagePost>(`/community/article/${id}`)

export const feedbackMessage = (
  messageId: number,
  attitude: 0 | 1 | undefined
) =>
  serverNoRepeatAjax(
    '/community/feedback',
    { i: messageId, l: attitude },
    'POST'
  )

export type CommunityTipQueryType = {
  messageId: number
  uid: number
  lastReplyUid: number
  count: number
  lastReplyTime: number
  nickname: string
  messageTitle: string
  lastReplyContent: string
  type: number
}

export const deletePost = (postId: number) =>
  serverNoRepeatAjax(`/community/article/${postId}/delete`, undefined, 'POST')
