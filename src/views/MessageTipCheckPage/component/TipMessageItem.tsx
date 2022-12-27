import React from 'react'
import { MessageTipTable, TipType } from '../../../sqlite/message_tip'
import { StyleSheet, Text, View } from 'react-native'
import Button from 'react-native-button'
import Avatar from '../../../component/Container/Avatar'
import { useNavigation } from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, UseNavigationGeneric } from '../../../router'
import { COMMENT_DETAIL_PAGE } from '../../ArticleDetailPage'

interface TipMessageItemProps {
  tip: MessageTipTable
}

const TipMessageItem: React.FC<TipMessageItemProps> = props => {
  const { tip } = props
  const nav = useNavigation<UseNavigationGeneric>()
  let extraStr = tip.count > 1 ? `等${tip.count}人回复了你` : ''
  const navToMessageDetail = () => {
    if (tip.type === TipType.TYPE_POST_REPLY) {
      // 直接加载帖子
      nav.navigate(ARTICLE_DETAIL_PAGE, {
        isSubReply: false,
        manual: { rootMessageId: tip.message_id },
      })
    } else {
      // 加载二级评论
      nav.navigate(ARTICLE_DETAIL_PAGE, {
        screen: COMMENT_DETAIL_PAGE,
        isSubReply: true,
        manual: { rootMessageId: tip.message_id },
      })
    }
  }

  return (
    <Button onPress={navToMessageDetail}>
      <View style={styles.container}>
        <Avatar uid={tip.last_reply_uid} />
        <View style={styles.textContainer}>
          <View>
            <Text>
              <Text style={styles.nameText}>{tip.last_reply_nickname}</Text>
              {extraStr}评论了你
            </Text>
            <Text>{tip.title}</Text>
          </View>
          <Text style={styles.rightText}>{tip.content}</Text>
        </View>
      </View>
    </Button>
  )
}

const styles = StyleSheet.create({
  nameText: {
    color: global.colors.textColor,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: global.colors.borderColor,
  },
  rightText: {
    textAlign: 'right',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
})

export default TipMessageItem
