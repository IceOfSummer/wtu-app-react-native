import React from 'react'
import { CommunityMessageQueryType } from '../../../../api/server/community'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Avatar, { getAvatarUrl } from '../../../../component/Container/Avatar'
import Icons from '../../../../component/Icons'
import { useNavigation } from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, UseNavigationGeneric } from '../../../../router'
import { formatTimestamp } from '../../../../utils/DateUtils'

interface ArticleItemProps {
  item: CommunityMessageQueryType
}

const ArticleItem: React.FC<ArticleItemProps> = props => {
  const { item } = props
  const nav = useNavigation<UseNavigationGeneric>()
  const toDetail = () => {
    nav.navigate(ARTICLE_DETAIL_PAGE, item)
  }

  return (
    <Pressable style={styles.container} onPress={toDetail}>
      <View style={styles.messageHeader}>
        <Avatar uri={getAvatarUrl(item.author)} />
        <Text style={styles.nickname}>{item.nickname}</Text>
      </View>
      <View style={styles.articleContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text numberOfLines={3}>{item.content}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text>{formatTimestamp(item.createTime)}</Text>
        <View style={global.styles.flexRow}>
          <View style={styles.status}>
            <Icons iconText="&#xe611;" />
            <Text>{item.like}</Text>
          </View>
          <View style={styles.status}>
            <Icons iconText="&#xe606;" />
            <Text>{item.dislike}</Text>
          </View>
          <View style={styles.status}>
            <Icons iconText="&#xe607;" />
            <Text>{item.replyCount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    padding: 15,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  titleText: {
    fontSize: global.styles.$font_size_base,
    color: global.colors.textColor,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 14,
    color: global.colors.textColor,
    marginLeft: global.styles.$spacing_row_base,
  },
  articleContainer: {
    marginVertical: global.styles.$spacing_col_base,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: global.styles.$spacing_row_sm,
  },
})

export default ArticleItem
