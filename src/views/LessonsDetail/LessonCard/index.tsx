import React from 'react'
import { ClassInfo } from '../../../redux/reducers/lessonsTable'
import { ColorValue, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../../redux/reducers'
import styles from './styles'

interface LessonCardProps {
  lessons: ClassInfo
}

const LessonCard: React.FC<
  LessonCardProps & StoreProps & StoreActions
> = props => {
  // 标题的颜色
  let titleColor: ColorValue
  // 标题旁边的提示文字
  let tipText: string = ''

  /**
   * 判断当前上课时间并初始化titleColor和tipText
   */
  if (props.week < props.lessons.startWeek) {
    // 课程还没开始
    titleColor = global.styles.$info_color
    tipText = '(暂未开课)'
  } else if (
    props.week >= props.lessons.startWeek &&
    props.week <= props.lessons.endWeek
  ) {
    // 正在上
    titleColor = global.styles.$primary_color
  } else {
    // 结课
    titleColor = global.styles.$success_color
    tipText = '(已结课)'
  }

  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardContainer}>
        <Text
          style={[
            {
              color: titleColor,
              marginBottom: global.styles.$spacing_col_base,
            },
            styles.title,
          ]}>
          {props.lessons.className + tipText}
        </Text>
        <Text style={styles.lessonsInfoText}>
          老师: {props.lessons.teacher}
        </Text>
        <Text style={styles.lessonsInfoText}>
          考试类型: {props.lessons.examType}
        </Text>
        <Text style={styles.lessonsInfoText}>
          上课地点: {props.lessons.location}
        </Text>
        <Text style={styles.lessonsInfoText}>
          课程类型: {props.lessons.lessonsType}
        </Text>
        <Text style={styles.lessonsInfoText}>
          课程组成: {props.lessons.contains}
        </Text>
        <Text style={styles.lessonsInfoText}>
          上课周: {props.lessons.startWeek}-{props.lessons.endWeek}周
        </Text>
      </View>
    </View>
  )
}

interface StoreProps {
  week: number
}

interface StoreActions {}

export default connect<StoreProps, StoreActions, LessonCardProps, ReducerTypes>(
  initialState => ({
    week: initialState.lessonsTable.options.week!,
  })
)(LessonCard)
