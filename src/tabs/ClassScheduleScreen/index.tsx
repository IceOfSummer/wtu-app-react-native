import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import styles from './styles'
import LessonCard from './LessonCard'
import LessonsTable from './LessonsTable'
import { ClassInfo } from '../../redux/reducers/lessonsTable'
import PopupDrawer from '../../component/PopupDrawer'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { showNavigationToast } from '../../component/DiyToast/NavToast'
import { SCHOOL_AUTH } from '../../router'
import { getLessons } from '../../api/edu/classes'
import { saveLessonsInfo } from '../../redux/actions/lessonsTable'
import PullDownRefreshView, {
  finishRefresh,
} from '../../native/component/BounceScrollView'
import NativeDialog from '../../native/modules/NativeDialog'

interface ClassScheduleProps {}

const ClassSchedule: React.FC<
  ClassScheduleProps & StoreActions & StoreStates
> = props => {
  const [todayLessons, setTodayLessons] = useState<Array<ClassInfo>>([])

  // 今天的星期
  const curDay = new Date().getDay()

  useEffect(() => {
    if (props.lessons) {
      setTodayLessons(splitTodayLessons(props.lessons))
    }
  }, [])

  /**
   * 自动加载数据, 返回true表示加载成功, false表示失败
   */
  async function loadData(): Promise<boolean> {
    return new Promise(resolve => {
      if (!props.isLoginValid || !props.username) {
        showNavigationToast({
          type: 'error',
          text1: '请先登录',
          routerName: SCHOOL_AUTH,
        })
        resolve(false)
        return
      }
      // load
      getLessons(props.username, props.year, props.term)
        .then(resp => {
          props.saveLessonsInfo(resp)
          resolve(true)
          if (resp.length === 0) {
            NativeDialog.showDialog({
              title: '当前设置下没有课哦',
              message: '点击右上角设置可以具体配置相关设置',
              hideCancelBtn: true,
            })
            return
          } else {
            setTodayLessons(splitTodayLessons(resp))
          }
        })
        .catch(() => resolve(false))
    })
  }

  function splitTodayLessons(lessons: Array<ClassInfo>): Array<ClassInfo> {
    const arr: Array<ClassInfo> = []
    lessons.forEach(value => {
      if (
        value.week === curDay &&
        value.startWeek <= props.week &&
        props.week <= value.endWeek
      ) {
        arr.push(value)
      }
    })
    return arr
  }

  /**
   * 计算并格式化当前时间
   */
  function getCurTime(): string {
    const date = new Date()
    const hour = date.getHours()
    let curTime = ''
    if (hour < 10) {
      curTime += '0'
    }
    curTime += `${hour}:`
    const minute = date.getMinutes()
    if (minute < 10) {
      curTime += '0'
    }
    curTime += minute
    return curTime
  }
  const curTime = getCurTime()

  const onPullDownRefresh = (finish: finishRefresh) => {
    loadData()
      .then(result => {
        console.log(result)
        finish(result)
      })
      .catch(e => {
        console.log(e)
        finish(false)
      })
  }

  return (
    <View style={styles.classScheduleContainer}>
      <PopupDrawer drawer={<LessonsTable />} drawerTitle="课程一览">
        <PullDownRefreshView
          scrollConfig={{ style: { height: '100%' } }}
          onRefresh={onPullDownRefresh}
          enableRefresh>
          <View style={styles.cardOuter}>
            <View style={styles.cardContainer}>
              <View>
                <Text style={styles.cardTitleText}>今日课程</Text>
              </View>
              <View>
                {todayLessons.length === 0 ? (
                  <Text style={{ textAlign: 'center', padding: 30 }}>
                    今天没有课哦!
                  </Text>
                ) : (
                  todayLessons.map((value, index) => (
                    <LessonCard
                      curTime={curTime}
                      classInfo={value}
                      key={index}
                    />
                  ))
                )}
              </View>
            </View>
          </View>
        </PullDownRefreshView>
      </PopupDrawer>
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
