import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import {
  CombinedEventRemind,
  EventRemindType,
} from '../../../../api/server/event_remind'
import AvatarContainer from '../../component/AvatarContainer'
import { formatTimestamp } from '../../../../utils/DateUtils'
import Button from 'react-native-button'
import { useNavigation } from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, UseNavigationGeneric } from '../../../../router'
import { COMMENT_DETAIL_PAGE } from '../../../ArticleDetailPage'
import Empty from '../../../../component/Container/Empty'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { clearLikeRemind } from '../../../../redux/counter/eventRemindSlice'

const LikeCheckPage: React.FC = () => {
  const like = useSelector<ReducerTypes, CombinedEventRemind[]>(
    state => state.eventRemind.likeReminds
  )
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      dispatch(clearLikeRemind())
    }
  }, [])
  return (
    <SpringScrollView>
      {like.map(value => (
        <RowItem remind={value} key={value.id} />
      ))}
      {like.length > 0 ? (
        <Text style={global.styles.infoTipText}>没有更多数据了...</Text>
      ) : (
        <Empty />
      )}
    </SpringScrollView>
  )
}
interface RowItem {
  remind: CombinedEventRemind
}

const RowItem: React.FC<RowItem> = props => {
  const { remind } = props
  const nav = useNavigation<UseNavigationGeneric>()
  const jump = () => {
    if (remind.sourceType === EventRemindType.LIKE_POST) {
      nav.navigate(ARTICLE_DETAIL_PAGE, {
        manual: { rootMessageId: remind.sourceId },
        isSubReply: false,
      })
    } else {
      nav.navigate(ARTICLE_DETAIL_PAGE, {
        manual: { rootMessageId: remind.sourceId },
        isSubReply: true,
        screen: COMMENT_DETAIL_PAGE,
      })
    }
  }
  return (
    <Button containerStyle={styles.container} onPress={jump}>
      <View style={styles.innerContainer}>
        <AvatarContainer uids={remind.senderIds} />
        <View style={styles.rightContainer}>
          <View>
            <Text style={styles.title}>{remind.remindTitle}</Text>
            <Text style={styles.time}>
              {formatTimestamp(remind.createTime)}
            </Text>
          </View>
          <Text style={styles.content}>{remind.targetContent}</Text>
        </View>
      </View>
    </Button>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.colors.boxBackgroundColor,
    borderTopColor: global.colors.borderColor,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  innerContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 5,
  },
  title: {
    color: global.colors.textColor,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 4,
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
  time: {
    color: global.colors.infoTextColor,
  },
})

export default LikeCheckPage
