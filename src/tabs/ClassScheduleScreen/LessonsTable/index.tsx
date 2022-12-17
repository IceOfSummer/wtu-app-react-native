import React from 'react'
import {
  ColorValue,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import styles, { HEADER_HEIGHT, PER_CLASS_HEIGHT } from './styles'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../../redux/reducers'
import { ClassInfo } from '../../../redux/types/lessonsTableTypes'
import { Link, useNavigation } from '@react-navigation/native'
import { LESSONS_DETAIL, RouterTypes, SCHOOL_AUTH } from '../../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import TappableView from '../../../component/TappableView'
import { useClassScheduleTheme } from '../Theme'
import { getSubjectStatus, SubjectStatus } from '../../../utils/LessonsUtils'

interface LessonsTableProps {}

const LessonsTable: React.FC<
  LessonsTableProps & StoreStates & StoreActions
> = props => {
  const theme = useClassScheduleTheme()
  const classScheduleTheme = theme.getTheme()
  return (
    <ImageBackground
      style={[
        styles.lessonsTableContainer,
        { backgroundColor: classScheduleTheme.classLabelBackground.color },
      ]}
      source={classScheduleTheme.classLabelBackground.image}>
      <Lessons lessons={props.lessons} curWeek={props.curWeek} />
    </ImageBackground>
  )
}

interface LessonsProps {
  lessons?: Array<ClassInfo>
  curWeek: number
}
type ProcessedClassInfo = {
  info: ClassInfo
  remove?: boolean
  status: SubjectStatus
}
/**
 * 渲染课程表, 一共有3种情况
 */
const Lessons: React.FC<LessonsProps> = props => {
  const deviceWidth = Dimensions.get('window').width
  const perBlockWidth = deviceWidth / 8
  const deviceHeight = Dimensions.get('window').height

  const lessons: Array<ProcessedClassInfo> = []
  /**
   * 预处理数组
   * O(n)
   */
  props.lessons?.forEach(value => {
    lessons.push({
      info: value,
      status: getSubjectStatus(value, props.curWeek),
    })
  })
  /**
   * 过滤每个课程, 防止重叠, 仅在课程卡片使用图片时过滤(卡片有透明度, 不同课程可能会重叠)
   * 优先级: 正在上课 > 未开始 > 已经结课
   * 让先结课的卡片先渲染, 后面相同的卡片会覆盖相应的位置
   * @see SubjectStatus 优先级凭据
   * 优先级高的会完全盖住优先级低的
   */
  if (props.lessons && props.lessons.length) {
    const copyArr = lessons.slice()
    copyArr.sort((a, b) => {
      return b.status - a.status
    })
    const heap = [
      new Array<boolean>(12),
      new Array<boolean>(12),
      new Array<boolean>(12),
      new Array<boolean>(12),
      new Array<boolean>(12),
      new Array<boolean>(12),
      new Array<boolean>(12),
    ]
    copyArr.forEach(value => {
      const { info } = value
      const week = info.week - 1
      const base = info.beginTime

      for (let i = 0; i < info.duration; i++) {
        if (heap[week][base + i]) {
          // 有课了!
          value.remove = true
          break
        } else {
          heap[week][base + i] = true
        }
      }
    })
  }

  if (!props.lessons) {
    return (
      <View style={{ height: deviceHeight }}>
        <Link to={`/${SCHOOL_AUTH}`} style={styles.linkText}>
          登录后再查看课表哦!
        </Link>
        <Text style={styles.tipText}>下拉可以刷新哦!</Text>
      </View>
    )
  } else if (props.lessons.length === 0) {
    return (
      <View style={{ flex: 1, paddingTop: 50 }}>
        <Text style={styles.tipText}>当前设置下没有课程哦!</Text>
        <Text style={styles.tipText}>请检查当前设置</Text>
        <Text style={styles.tipText}>点击右上角齿轮可以进入设置</Text>
        <Text style={styles.tipText}>下拉可以刷新哦!</Text>
      </View>
    )
  } else {
    return (
      <View>
        <View>
          {lessons.map((value, index) =>
            value.remove ? null : (
              <LessonItem
                status={value.status}
                lesson={value.info}
                key={index}
                curWeek={props.curWeek}
              />
            )
          )}
        </View>
        <View style={styles.header}>
          <View style={[styles.sidebar, { width: perBlockWidth }]}>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>1</Text>
              <Text style={styles.sidebarText}>08:00</Text>
              <Text style={styles.sidebarText}>08:45</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>2</Text>
              <Text style={styles.sidebarText}>08:50</Text>
              <Text style={styles.sidebarText}>09:35</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>3</Text>
              <Text style={styles.sidebarText}>09:55</Text>
              <Text style={styles.sidebarText}>10:40</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>4</Text>
              <Text style={styles.sidebarText}>10:45</Text>
              <Text style={styles.sidebarText}>11:30</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>5</Text>
              <Text style={styles.sidebarText}>11:35</Text>
              <Text style={styles.sidebarText}>12:20</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>6</Text>
              <Text style={styles.sidebarText}>14:00</Text>
              <Text style={styles.sidebarText}>14:45</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>7</Text>
              <Text style={styles.sidebarText}>14:50</Text>
              <Text style={styles.sidebarText}>15:35</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>8</Text>
              <Text style={styles.sidebarText}>15:55</Text>
              <Text style={styles.sidebarText}>16:40</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>9</Text>
              <Text style={styles.sidebarText}>16:45</Text>
              <Text style={styles.sidebarText}>17:30</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>10</Text>
              <Text style={styles.sidebarText}>19:00</Text>
              <Text style={styles.sidebarText}>19:45</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>11</Text>
              <Text style={styles.sidebarText}>19:50</Text>
              <Text style={styles.sidebarText}>20:35</Text>
            </View>
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarText}>12</Text>
              <Text style={styles.sidebarText}>20:40</Text>
              <Text style={styles.sidebarText}>21:35</Text>
            </View>
          </View>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期一
          </Text>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期二
          </Text>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期三
          </Text>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期四
          </Text>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期五
          </Text>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期六
          </Text>
          <Text style={[styles.headerText, { width: perBlockWidth }]}>
            星期日
          </Text>
        </View>
      </View>
    )
  }
}

interface LessonItemProps {
  lesson: ClassInfo
  curWeek: number
  status: SubjectStatus
}

/**
 * 课程卡片组件
 */
const LessonItem: React.FC<LessonItemProps> = props => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  const deviceWidth = Dimensions.get('window').width
  const perBlockWidth = deviceWidth / 8
  const status = props.status
  const theme = useClassScheduleTheme()
  const classScheduleTheme = theme.getTheme()

  const seeLessonsDetail = (classInfo: ClassInfo) => {
    nav.navigate(LESSONS_DETAIL, {
      startTime: classInfo.beginTime,
      week: classInfo.week,
    })
  }

  /**
   * 计算当前课程的left值
   */
  const countLeftValue = (classInfo: ClassInfo) => {
    return classInfo.week * perBlockWidth
  }

  /**
   * 计算当前课程的top值
   */
  const countTopValue = (classInfo: ClassInfo) => {
    return classInfo.beginTime * PER_CLASS_HEIGHT + HEADER_HEIGHT
  }

  const height = props.lesson.duration * PER_CLASS_HEIGHT

  return (
    <TappableView
      style={[
        styles.lessonItem,
        {
          left: countLeftValue(props.lesson),
          top: countTopValue(props.lesson),
        },
      ]}
      key={props.lesson.id + props.lesson.week}
      onPress={() => seeLessonsDetail(props.lesson)}>
      <View
        style={{
          height: height,
          width: perBlockWidth,
          padding: 2,
          borderRadius: 4,
          position: 'relative',
        }}>
        <ThemedContainer status={status} width={perBlockWidth} height={height}>
          <Text
            style={[
              styles.lessonText,
              { color: classScheduleTheme.textColor },
            ]}>
            {props.lesson.className} @{props.lesson.location}
          </Text>
        </ThemedContainer>
      </View>
    </TappableView>
  )
}

const ThemedContainer: React.FC<{
  status: SubjectStatus
  width: number
  height: number
}> = props => {
  const theme = useClassScheduleTheme()
  const classScheduleTheme = theme.getTheme()

  let labelColor: ColorValue | undefined
  let image: any | undefined
  const colors = classScheduleTheme.classLabel.color
  const img = classScheduleTheme.classLabel.image
  if (props.status === SubjectStatus.notStarted) {
    labelColor = colors?.notStartedClass
    image = img?.notStartedClass
  } else if (props.status === SubjectStatus.active) {
    labelColor = colors?.activeClass
    image = img?.activeClass
  } else {
    labelColor = colors?.endedClass
    image = img?.endedClass
  }
  /**
   * 判断背景类型
   */
  return (
    <View
      style={[
        styles.lessonItemContainer,
        {
          backgroundColor: labelColor,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: global.styles.$border_color,
        },
      ]}>
      <Image
        source={image}
        style={{
          width: props.width,
          height: props.height,
          position: 'absolute',
          opacity: 0.6,
        }}
      />
      {props.children}
    </View>
  )
}

interface StoreStates {
  lessons?: Array<ClassInfo>
  curWeek: number
}

interface StoreActions {}

export default connect<
  StoreStates,
  StoreActions,
  LessonsTableProps,
  ReducerTypes
>(initialState => ({
  lessons: initialState.lessonsTable.lessons,
  curWeek: initialState.lessonsTable.options.week,
}))(LessonsTable)
