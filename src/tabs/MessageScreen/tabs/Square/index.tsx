import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Icons from '../../../../component/Icons'
import useNav from '../../../../hook/useNav'
import { POST_ARTICLE_PAGE } from '../../../../router'
import { LoadingScrollView } from '../../../../component/LoadingScrollView'
import {
  CommunityMessageQueryType,
  queryNewlyCommunityMessage,
} from '../../../../api/server/community'
import ArticleItem from '../../components/ArticleItem'
import { showSingleBtnTip } from '../../../../native/modules/NativeDialog'

const Square: React.FC = () => {
  const [messages, setMessages] = useState<CommunityMessageQueryType[]>([])
  const [loading, setLoading] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [error, setError] = useState(false)
  const maxId = useRef<number | undefined>()
  const loadMore = () => {
    if (loading) {
      return
    }
    setLoading(true)
    queryNewlyCommunityMessage(maxId.current)
      .then(r => {
        setError(false)
        if (r.data.length === 0) {
          setEmpty(true)
          return
        }
        const lastId = r.data[r.data.length - 1].id
        if (lastId === 1) {
          setEmpty(true)
        }
        maxId.current = lastId - 1
        setMessages(messages.concat(r.data))
      })
      .catch(e => {
        showSingleBtnTip('请求失败', e.message)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadMore()
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <LoadingScrollView
        loading={loading}
        onRequireLoad={loadMore}
        empty={empty}
        dataLength={messages.length}
        error={error}>
        {messages.map(value => (
          <ArticleItem item={value} key={value.id} />
        ))}
      </LoadingScrollView>
      <PostButton />
    </View>
  )
}

const PostButton: React.FC = () => {
  const nav = useNav()
  const toArticlePost = () => {
    nav.push(POST_ARTICLE_PAGE)
  }
  return (
    <Pressable style={styles.addButtonContainer} onPress={toArticlePost}>
      <Icons iconText="&#xe625;" color="#fff" size={25} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    backgroundColor: global.colors.primaryColor,
    padding: 10,
    borderRadius: 50,
    bottom: 15,
    right: 15,
  },
})

export default Square
