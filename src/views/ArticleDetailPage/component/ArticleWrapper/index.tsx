import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { UseRouteGeneric } from '../../../../router'
import {
  CommunityMessageQueryType,
  queryArticleById,
} from '../../../../api/server/community'
import EnhancedLoadingView from '../../../../component/Loading/EnhancedLoadingView'

interface ArticleWrapperProps {
  content: React.FC<{ article: CommunityMessageQueryType }>
}
const ArticleWrapper: React.FC<ArticleWrapperProps> = props => {
  const { params } = useRoute<UseRouteGeneric<'ArticleDetailPage'>>()
  const [data, setData] = useState<CommunityMessageQueryType | null>(null)
  const Component = props.content
  const loadPost = async () => {
    console.log('param')
    console.log(params)
    if (params.prepared) {
      return { code: 0, data: params.prepared, message: '' }
    } else if (params.manual) {
      return await queryArticleById(params.manual.rootMessageId)
    } else {
      throw new Error('消息加载失败，未传入根消息任何信息')
    }
  }
  console.log(data)
  return (
    <EnhancedLoadingView
      loadData={loadPost}
      setData={setData}
      style={{ flex: 1 }}>
      <Component article={data!} />
    </EnhancedLoadingView>
  )
}

export default ArticleWrapper
