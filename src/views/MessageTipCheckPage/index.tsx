import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BottomAutoLoadScrollView from '../../component/ScrollViews/BottomAutoLoadScrollView'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../redux/counter'
import TipMessageItem from './component/TipMessageItem'
import MessageTipMapper, { MessageTipTable } from '../../sqlite/message_tip'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../utils/LoggerUtils'
import ConditionHideContainer from '../../component/Container/ConditionHideContainer'
const logger = getLogger('/views/MessageTipCheckPage')
const MessageTipCheckPage: React.FC = () => {
  const state = useStore<ReducerTypes>().getState()
  const newlyTip = state.temporary.messageTips
  const currentPage = useRef(1)
  const [historyTip, setHistoryTip] = useState<Array<MessageTipTable>>([])
  const [empty, setEmpty] = useState(false)
  const loadMore = () =>
    new Promise<void>(async resolve => {
      logger.info('loading history message')
      try {
        const history = await MessageTipMapper.selectHistoryMessage(
          currentPage.current++
        )
        if (history.length === 0) {
          setEmpty(true)
          resolve()
          return
        }
        setHistoryTip(historyTip.concat(history))
      } catch (e: any) {
        Toast.show('加载历史消息失败: ' + e.message)
        logger.info('load history message failed: ' + e.message)
      }
      resolve()
    })

  useEffect(() => {
    loadMore().catch()
  }, [])
  return (
    <View style={styles.container}>
      <BottomAutoLoadScrollView loadCallback={loadMore} allLoaded={empty}>
        <ConditionHideContainer
          style={styles.tipContainer}
          hide={newlyTip.length === 0}>
          <Text style={styles.title}>新消息</Text>
          {newlyTip.map(value => (
            <TipMessageItem tip={value} key={value.message_id} />
          ))}
        </ConditionHideContainer>
        <ConditionHideContainer
          style={styles.tipContainer}
          hide={historyTip.length === 0}>
          <Text style={styles.title}>历史消息</Text>
          {historyTip.map(value => (
            <TipMessageItem tip={value} key={value.message_id} />
          ))}
        </ConditionHideContainer>
        <ConditionHideContainer
          hide={historyTip.length + newlyTip.length !== 0}>
          <Text style={global.styles.infoTipText}>没有新消息</Text>
        </ConditionHideContainer>
      </BottomAutoLoadScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: global.colors.boxBackgroundColor,
    flex: 1,
  },
  title: {
    color: global.colors.textColor,
    borderBottomColor: global.colors.borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 4,
  },
  tipContainer: {
    marginVertical: 5,
  },
})

export default MessageTipCheckPage
