import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import useAutoColorStatusBar from '../../hook/useAutoColorStatusBar'
import styles from './styles'
import PageLink from '../../component/PageLink'
import { CLASS_SCHEDULE_TABS, RouterTypes, WEB_PAGE } from '../../router'
import { EduSystem, HealthReport } from '../../views/Webpage'
import { connect, useSelector } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import MessageCard from './MessageCard'
import { getLastSignInfo } from '../../api/edu/sign'
import { ClassInfo } from '../../redux/types/lessonsTableTypes'
import { splitTodayLessons } from '../../utils/LessonsUtils'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

const Index: React.FC<StorePros & StoreActions> = props => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  const colors = useSelector<ReducerTypes, ThemeColors>(
    state => state.theme.colors
  )
  useAutoColorStatusBar(true, colors.primaryColor)

  const [healthSignMessage, setHealthSignMessage] = useState('加载中')

  useEffect(() => {
    if (props.isCheckLoginDone) {
      if (props.isLoginValid) {
        getLastSignInfo()
          .then(status => {
            if (!status) {
              setHealthSignMessage('今天还没有打卡')
              return
            }
            const now = new Date()
            if (
              now.getFullYear() !== status.getFullYear() ||
              now.getMonth() !== status.getMonth() ||
              now.getDate() !== status.getDate()
            ) {
              setHealthSignMessage('今天还没有打卡')
              return
            }
            setHealthSignMessage('今天已经打卡了')
          })
          .catch(() => null)
      } else {
        setHealthSignMessage('登录后再查看哦!')
      }
    }
  }, [props.isCheckLoginDone, props.isLoginValid])

  /**
   * 初始化头部文字
   */
  let headerText: string
  let headerTipText: string
  ;(function () {
    const hours = new Date().getHours()
    if (hours < 7) {
      headerText = '夜深了'
      headerTipText = '熬夜不好哦'
    } else if (hours < 12) {
      headerText = '早上好'
      headerTipText = '忘掉不开心的事, 新的一天又开始了!'
    } else if (hours < 14) {
      headerText = '中午好'
      headerTipText = '适当睡睡午觉也挺好的'
    } else if (hours < 19) {
      headerText = '下午好'
      headerTipText = '忙碌的一天终于快要结束了'
    } else {
      headerText = '晚上好'
      headerTipText = '晚上好好放松一下吧!'
    }
  })()

  /**
   * 生成课程信息文字
   */
  const [lessonsMessage, setLessonsMessage] = useState('')
  useEffect(() => {
    const len = splitTodayLessons(props.week, props.lessons).length
    setLessonsMessage(`今天有${len}节课`)
  }, [props.lessons, props.week])

  return (
    <View>
      <View style={{ backgroundColor: colors.primaryColor }}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={[styles.headerText, styles.headerTitleText]}>
              {headerText}
            </Text>
            <Text style={[styles.headerText, styles.headerTipText]}>
              {headerTipText}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.fastLinkContainer}>
        <PageLink
          title="健康打卡"
          path={WEB_PAGE}
          routeParam={{
            url: HealthReport,
          }}
          iconConfig={{
            iconText: '&#xf004;',
            parseUnicode: true,
            size: 40,
            color: global.styles.$primary_color,
          }}
        />
        <PageLink
          title="教务系统"
          path={WEB_PAGE}
          iconConfig={{
            iconText: '&#xf051;',
            parseUnicode: true,
            size: 40,
            color: global.styles.$primary_color,
          }}
          routeParam={{
            url: EduSystem,
          }}
        />
      </View>
      <View>
        <MessageCard
          title="今日课程"
          backgroundColor="orange"
          onPress={() => nav.navigate(CLASS_SCHEDULE_TABS)}
          message={lessonsMessage}
        />
        <MessageCard
          title="健康打卡"
          backgroundColor="skyblue"
          onPress={() => nav.navigate(WEB_PAGE, { url: HealthReport })}
          message={healthSignMessage}
        />
      </View>
    </View>
  )
}

interface StorePros {
  isLoginValid: boolean
  lessons?: Array<ClassInfo>
  week: number
  isCheckLoginDone: boolean
}
interface StoreActions {}

export default connect<StorePros, StoreActions, {}, ReducerTypes>(
  initialState => ({
    isLoginValid: initialState.user.isLoginValid,
    lessons: initialState.lessonsTable.lessons,
    week: initialState.lessonsTable.options.week,
    isCheckLoginDone: initialState.temporary.isCheckLoginDone,
  })
)(Index)
