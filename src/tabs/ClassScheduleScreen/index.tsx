import React, { useEffect, useRef, useState } from 'react'
import { ImageBackground, PanResponder, Text, View } from 'react-native'
import styles from './styles'
import LessonCard from './LessonCard'
import LessonsTable from './LessonsTable'
import { ClassInfo } from '../../redux/types/lessonsTableTypes'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { showNavigationToast } from '../../component/DiyToast/NavToast'
import { SCHOOL_AUTH } from '../../router'
import { getLessons } from '../../api/edu/classes'
import { saveLessonsInfo } from '../../redux/actions/lessonsTable'
import NativeDialog from '../../native/modules/NativeDialog'
import { splitTodayLessons } from '../../utils/LessonsUtils'
import Drawer from 'react-native-drawer'
import { useClassScheduleTheme } from './Theme'
import { SpringScrollView } from 'react-native-spring-scrollview'
import { ChineseWithLastDateHeader } from 'react-native-spring-scrollview/Customize'

interface ClassScheduleProps {}

const ClassSchedule: React.FC<
  ClassScheduleProps & StoreActions & StoreStates
> = props => {
  const [todayLessons, setTodayLessons] = useState<Array<ClassInfo>>([])
  const scrollView = useRef<SpringScrollView>(null)

  useEffect(() => {
    if (props.lessons) {
      setTodayLessons(splitTodayLessons(props.week, props.lessons))
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
            setTodayLessons(splitTodayLessons(props.week, resp))
          }
        })
        .catch(() => resolve(false))
    })
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

  const onPullDownRefresh = () => {
    loadData()
      .then(result => {
        console.log(result)
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        scrollView.current?.endRefresh()
      })
  }

  /**
   * drawer 逻辑
   */
  const drawer = useRef<Drawer>(null)
  const TOGGLE_DRAWER_DISTANCE = 100
  const MIN_TOGGLE_SPEED = 1
  const isDrawerOpen = useRef(false)
  const lessonsTableControlPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease(evt, state) {
        if (Math.abs(state.vy) < MIN_TOGGLE_SPEED) {
          return
        }
        if (state.dy < 0 && -state.dy > TOGGLE_DRAWER_DISTANCE) {
          // open
          isDrawerOpen.current = true
          drawer.current?.open()
        } else if (state.dy > 0 && state.dy > TOGGLE_DRAWER_DISTANCE) {
          // close
          isDrawerOpen.current = false
          drawer.current?.close()
        }
      },
    })
  ).current

  const theme = useClassScheduleTheme().getTheme()
  return (
    <View {...lessonsTableControlPan.panHandlers}>
      <ImageBackground
        style={[
          styles.classScheduleContainer,
          { backgroundColor: theme.background.color },
        ]}
        source={theme.background.image}>
        <Drawer
          ref={drawer}
          type="overlay"
          content={<LessonsTable />}
          tweenDuration={200}
          tweenEasing="easeOutSine"
          side="bottom">
          <SpringScrollView
            onRefresh={onPullDownRefresh}
            ref={scrollView}
            refreshHeader={ChineseWithLastDateHeader}>
            <View style={styles.blockOuter}>
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
              <View>
                <Text
                  style={[
                    {
                      color: theme.infoTextColor,
                      fontSize: global.styles.$font_size_sm,
                    },
                    global.styles.centerText,
                  ]}>
                  下滑可以显示课程表哦!
                </Text>
              </View>
            </View>
          </SpringScrollView>
        </Drawer>
      </ImageBackground>
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
