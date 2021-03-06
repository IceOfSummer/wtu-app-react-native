import React from 'react'
import { View, Text, ColorValue, Pressable } from 'react-native'
import styles from './styles'
import { ClassInfo } from '../../../redux/types/lessonsTableTypes'
import { useNavigation } from '@react-navigation/native'
import { LESSONS_DETAIL, RouterTypes } from '../../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

interface LessonCardProps {
  classInfo: ClassInfo
  curTime: string
}

const START_TIME_MAP = [
  '08:00',
  '08:50',
  '09:55',
  '10:45',
  '11:35',
  '14:00',
  '14:50',
  '15:55',
  '16:45',
  '19:00',
  '19:50',
  '20:40',
]
const END_TIME_MAP = [
  '08:45',
  '09:35',
  '10:40',
  '11:30',
  '12:20',
  '14:45',
  '15:35',
  '16:40',
  '17:30',
  '19:45',
  '20:35',
  '21:35',
]

const LessonCard: React.FC<LessonCardProps> = props => {
  const start = START_TIME_MAP[props.classInfo.beginTime]
  const end =
    END_TIME_MAP[props.classInfo.beginTime + props.classInfo.duration - 1]
  const nav = useNavigation<NavigationProp<RouterTypes>>()

  const seeLessonsDetail = () => {
    nav.navigate(LESSONS_DETAIL, {
      startTime: props.classInfo.beginTime,
      week: props.classInfo.week,
    })
  }

  const getColor = (): ColorValue => {
    if (props.curTime > end) {
      // 结束了
      return global.styles.$text_disable
    } else if (props.curTime < start) {
      // 还没有开始
      return '#a6a4ff'
    } else {
      // 正在上课
      return global.styles.$primary_color
    }
  }

  return (
    <View style={styles.blockOuter}>
      <Pressable
        style={[styles.cardContainer, { backgroundColor: getColor() }]}
        onPress={seeLessonsDetail}>
        <Text style={styles.classNameTitle}>
          {props.classInfo.className}/@{props.classInfo.location}
        </Text>
        <Text style={styles.textContent}>
          {start}-{end}
        </Text>
      </Pressable>
    </View>
  )
}

export default LessonCard
