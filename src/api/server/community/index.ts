import { serverNoRepeatAjax, serverNormalAjax } from '../../request'

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
}

export type PostArticleType = {
  /**
   * 父评论的id，为0时表示没有父消息
   */
  pid: number
  title?: string
  content: string
  replyTo?: number
}

export type CommunityMessageQueryType = CommunityMessage & {
  nickname: string
}
export const postArticle = (post: PostArticleType) =>
  serverNoRepeatAjax<number>('/community/post', post, 'POST')

export const queryNewlyCommunityMessage = (param: {
  maxId?: number
  minId?: number
}) =>
  serverNoRepeatAjax<CommunityMessageQueryType[]>('/community/newly_message', {
    mi: param.minId,
    mx: param.maxId,
  })

export const queryReply = (pid: number, page = 0, size = 5) =>
  serverNoRepeatAjax<CommunityMessageQueryType[]>('/community/reply/query', {
    pi: pid,
    p: page,
    s: size,
  })

export const querySubReplyPreview = (pids: string) =>
  serverNormalAjax<CommunityMessageQueryType[]>('/community/reply/preview', {
    p: pids,
  })

export const feedbackMessage = (
  messageId: number,
  attitude: 0 | 1 | undefined
) =>
  serverNoRepeatAjax(
    '/community/feedback',
    { i: messageId, l: attitude },
    'POST'
  )
