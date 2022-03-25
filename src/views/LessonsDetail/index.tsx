import React from 'react'
import { ClassInfo } from '../../redux/reducers/lessonsTable'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { Text, View } from 'react-native'
import styles from './styles'
import { RouteProp, useRoute } from '@react-navigation/native'
import { LESSONS_DETAIL, RouterTypes } from '../../router'
import LessonCard from './LessonCard'

interface LessonsDetailProps {}

type RouteTypes = RouteProp<Pick<RouterTypes, typeof LESSONS_DETAIL>>

const LessonsDetail: React.FC<
  LessonsDetailProps & StoreProps & StoreActions
> = props => {
  const route = useRoute<RouteTypes>()

  // find lessons
  const targetLessons: Array<ClassInfo> = []

  props.lessons?.forEach(value => {
    if (
      value.week === route.params.week &&
      value.beginTime === route.params.startTime
    ) {
      targetLessons.push(value)
    }
  })

  if (!props.lessons || props.lessons.length === 0) {
    return (
      // 没有课
      <View>
        <Text style={[styles.tipText, { textAlign: 'center' }]}>
          当前时间没有课哦!
        </Text>
      </View>
    )
  } else {
    return (
      <View>
        {targetLessons.map((value, index) => (
          <LessonCard lessons={value} key={index} />
        ))}
      </View>
    )
  }
}

interface StoreProps {
  lessons?: Array<ClassInfo>
}

interface StoreActions {}

export default connect<
  StoreProps,
  StoreActions,
  LessonsDetailProps,
  ReducerTypes
>(initialState => ({
  lessons: initialState.lessonsTable.lessons,
}))(LessonsDetail)
