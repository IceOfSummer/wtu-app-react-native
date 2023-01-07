import React, { useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import LessonsTable from './LessonsTable'
import { ClassInfo } from '../../redux/types/lessonsTableTypes'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { showNavigationToast } from '../../component/DiyToast/NavToast'
import { SCHOOL_AUTH } from '../../router'
import { getLessons } from '../../api/edu/classes'
import { saveLessonsInfo } from '../../redux/actions/lessonsTable'
import NativeDialog from '../../native/modules/NativeDialog'
import Toast from 'react-native-root-toast'
import { getLogger } from '../../utils/LoggerUtils'

const logger = getLogger('/tabs/ClassScheduleScreen')

interface ClassScheduleProps {}

const ClassSchedule: React.FC<
  ClassScheduleProps & StoreActions & StoreStates
> = props => {
  const [refreshing, setRefreshing] = useState(false)

  /**
   * 自动加载数据, 返回true表示加载成功, false表示失败
   */
  async function loadData() {
    return new Promise(resolve => {
      if (!props.isLoginValid || !props.username) {
        showNavigationToast({
          type: 'error',
          text1: '请先登录',
          routerName: SCHOOL_AUTH,
        })
        return
      }
      // load
      logger.info('loading class table')
      getLessons(props.username, props.year, props.term)
        .then(resp => {
          logger.info('load class table success')
          props.saveLessonsInfo(resp)
          resolve(true)
          if (resp.length === 0) {
            NativeDialog.showDialog({
              title: '当前设置下没有课哦',
              message: '点击右上角设置可以具体配置相关设置',
              hideCancelBtn: true,
            })
            return
          }
        })
        .catch(e => {
          logger.error('load class table failed: ' + e.message)
          Toast.show('加载课表失败: ' + e.message)
        })
    })
  }

  const onPullDownRefresh = () => {
    setRefreshing(true)
    loadData().finally(() => {
      setRefreshing(false)
    })
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: global.colors.boxBackgroundColor }}
        refreshControl={
          <RefreshControl
            colors={[global.colors.primaryColor]}
            refreshing={refreshing}
            onRefresh={onPullDownRefresh}
          />
        }>
        <LessonsTable />
      </ScrollView>
    </View>
  )
}

interface StoreStates {
  username?: string
  week: number
  year: number
  term: 3 | 12
  isLoginValid: boolean
  lessons?: Array<ClassInfo>
}

interface StoreActions {
  saveLessonsInfo: (...args: Parameters<typeof saveLessonsInfo>) => void
}

export default connect<
  StoreStates,
  StoreActions,
  ClassScheduleProps,
  ReducerTypes
>(
  initialState => ({
    username: initialState.user.username,
    week: initialState.lessonsTable.options.week!,
    year: initialState.lessonsTable.options.year!,
    term: initialState.lessonsTable.options.term!,
    isLoginValid: initialState.user.isLoginValid,
    lessons: initialState.lessonsTable.lessons,
  }),
  {
    saveLessonsInfo,
  }
)(ClassSchedule)
