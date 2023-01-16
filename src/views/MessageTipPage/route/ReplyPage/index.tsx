import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReducerTypes } from '../../../../redux/counter'
import { CombinedEventRemind } from '../../../../api/server/event_remind'
import { StyleSheet, Text, View } from 'react-native'
import Empty from '../../../../component/Container/Empty'
import { useNavigation } from '@react-navigation/native'
import { ARTICLE_DETAIL_PAGE, UseNavigationGeneric } from '../../../../router'
import { COMMENT_DETAIL_PAGE } from '../../../ArticleDetailPage'
import Button from 'react-native-button'
import AvatarContainer from '../../component/AvatarContainer'
import { formatTimestamp } from '../../../../utils/DateUtils'
import { clearReplyRemind } from '../../../../redux/counter/eventRemindSlice'
import { LoadingScrollView } from '../../../../component/LoadingScrollView'
import ConditionHideContainer from '../../../../component/Container/ConditionHideContainer'
import useHistoryRemind from '../../hook/useHistoryRemind'
import { AbstractType } from '../../../../sqlite/event_remind'

const ReplyPage: React.FC = () => {
  const reply = useSelector<ReducerTypes, CombinedEventRemind[]>(
    state => state.eventRemind.replyReminds
  )
  const scroll = useRef<LoadingScrollView>(null)
  const { loadData, data, empty } = useHistoryRemind(AbstractType.REPLY, reply)

  const loadMore = () => {
    loadData()
    scroll.current?.endLoading()
  }

  const dispatch = useDispatch()
  useEffect(() => {
    loadMore()
    return () => {
      dispatch(clearReplyRemind())
    }
  }, [])
  return (
    <LoadingScrollView
      ref={scroll}
      empty={empty}
      onRequireLoad={loadMore}
      dataLength={data.length}
      error={false}>
      <ConditionHideContainer hide={reply.length === 0}>
        <View>
          <Text style={styles.headerText}>最新消息</Text>
          {reply.map(value => (
            <RowItem remind={value} key={value.id} />
          ))}
        </View>
      </ConditionHideContainer>
      <ConditionHideContainer hide={data.length === 0}>
        <Text style={styles.headerText}>历史消息</Text>
        {data.map(value => (
          <RowItem remind={value} key={value.id} />
        ))}
      </ConditionHideContainer>
      {data.length + reply.length > 0 ? (
        <Text style={global.styles.infoTipText}>没有更多数据了...</Text>
      ) : (
        <Empty />
      )}
    </LoadingScrollView>
  )
}

interface RowItemProps {
  remind: CombinedEventRemind
}

const RowItem: React.FC<RowItemProps> = props => {
  const { remind } = props
  const nav = useNavigation<UseNavigationGeneric>()
  const jump = () => {
    nav.navigate(ARTICLE_DETAIL_PAGE, {
      manual: { rootMessageId: remind.sourceId },
      isSubReply: true,
      screen: COMMENT_DETAIL_PAGE,
    })
  }
  return (
    <Button containerStyle={styles.container} onPress={jump}>
      <View style={styles.innerContainer}>
        <AvatarContainer uids={remind.senderIds} />
        <View style={styles.rightContainer}>
          <View>
            <Text style={styles.title}>
              {remind.remindTitle}
              <Text style={styles.time}>
                ({formatTimestamp(remind.createTime)})
              </Text>
            </Text>
            <Text>{remind.sourceContent}</Text>
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
    paddingHorizontal: 10,
  },
  innerContainer: {
    borderBottomColor: global.colors.backgroundColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  outerContainer: {
    flex: 1,
    backgroundColor: global.colors.boxBackgroundColor,
  },
  headerText: {
    padding: 4,
    color: global.colors.textColor,
    fontSize: global.styles.$font_size_sm,
  },
})

export default ReplyPage
