import React, { useEffect, useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from 'react-native'
import styles, { PULL_DOWN_AREA_HEIGHT } from './styles'
import LessonCard from './LessonCard'
import LessonsTable from './LessonsTable'
import { ClassInfo } from '../../redux/reducers/lessonsTable'
import InitModal from '../../component/InitModal'

const MOCK_DATA: Array<ClassInfo> = [
  {
    className: 'abc',
    beginTime: 1,
    duration: 2,
    location: 'xx',
    week: 4,
  },
  {
    className: 'ccc',
    beginTime: 1,
    duration: 2,
    location: 'xxa',
    week: 4,
  },
  {
    className: 'abcde',
    beginTime: 1,
    duration: 2,
    location: 'xxdd',
    week: 4,
  },
  {
    className: 'abc',
    beginTime: 1,
    duration: 2,
    location: 'xx',
    week: 4,
  },
]

const ClassSchedule: React.FC = () => {
  const [todayLessons, setTodayLessons] = useState<Array<ClassInfo>>([])
  // 屏幕可用高度(不包括tabs和header)
  const [availableHeight, setAvailableHeight] = useState(0)
  // 今日课程卡片高度
  const [cardHeight, setCardHeight] = useState(0)
  const scroll = useRef<ScrollView>(null)
  // 在滚动条位置初始化完毕后再显示内容, 优化视觉体验
  const [isLoadSuccess, setLoadSuccess] = useState(false)

  // 今天的星期
  const curDay = new Date().getDay()

  useEffect(() => {
    // TODO 测试用, 后面删掉
    setTodayLessons(splitTodayLessons(MOCK_DATA))
    setTimeout(() => {
      scroll.current?.scrollTo({ y: PULL_DOWN_AREA_HEIGHT, animated: true })
      requestAnimationFrame(() => {
        setLoadSuccess(true)
      })
    }, 100)
    console.log('effect')
  }, [])

  function splitTodayLessons(lessons: Array<ClassInfo>): Array<ClassInfo> {
    const arr: Array<ClassInfo> = []
    lessons.forEach(value => {
      if (value.week === curDay) {
        arr.push(value)
      }
    })
    return arr
  }

  /**
   * 标记是否可以开启下拉刷新
   * 若要开启，需要在松开滑动时，位置在顶部，而不是靠滑动后的惯性触发刷新
   */
  const isRefresh = useRef(false)

  const endDragEvent = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (nativeEvent.contentOffset.y < PULL_DOWN_AREA_HEIGHT / 2) {
      isRefresh.current = true
    }
  }

  const onScrollEndEvent = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const curPos = nativeEvent.contentOffset.y
    if (curPos < PULL_DOWN_AREA_HEIGHT) {
      scroll.current?.scrollTo({ y: PULL_DOWN_AREA_HEIGHT })
      if (curPos < PULL_DOWN_AREA_HEIGHT / 2 && isRefresh.current) {
        isRefresh.current = false
        // TODO 下拉刷新
        console.log('refresh')
      }
    }
  }

  return (
    <View
      style={styles.classScheduleContainer}
      onLayout={event => setAvailableHeight(event.nativeEvent.layout.height)}>
      <ScrollView
        ref={scroll}
        snapToOffsets={[
          PULL_DOWN_AREA_HEIGHT,
          availableHeight + PULL_DOWN_AREA_HEIGHT,
        ]}
        snapToStart={true}
        snapToEnd={false}
        onScrollEndDrag={endDragEvent}
        onMomentumScrollEnd={onScrollEndEvent}
        showsVerticalScrollIndicator={false}
        snapToInterval={0}>
        <View>
          {/* 此处用于下拉刷新, 高度固定为 styles.PULL_DOWN_AREA_HEIGHT */}
          <View style={styles.pullDownArea}>
            <Text
              style={{
                color: global.styles.$primary_color,
                textAlign: 'center',
              }}>
              松开刷新
            </Text>
          </View>
          <View
            style={styles.cardOuter}
            onLayout={event => setCardHeight(event.nativeEvent.layout.height)}>
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
                    <LessonCard {...value} key={index} />
                  ))
                )}
              </View>
            </View>
          </View>
          {/* 避免元素突然闪一下 */}
          {availableHeight === 0 ? null : (
            <View
              style={{
                paddingTop: availableHeight - cardHeight - 60,
                paddingBottom: 100,
              }}>
              <LessonsTable />
            </View>
          )}
        </View>
      </ScrollView>
      <InitModal showLoadingAnimation visible={!isLoadSuccess} />
    </View>
  )
}

export default ClassSchedule
