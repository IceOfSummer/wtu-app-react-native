import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import { ClassInfo } from '../../../redux/reducers/lessonsTable'

const LessonCard: React.FC<ClassInfo> = props => {
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardContainer}>
        <Text style={styles.classNameTitle}>
          {props.className}/{props.location}
        </Text>
        <Text style={styles.textContent}>
          {props.beginTime}+{props.duration}
        </Text>
      </View>
    </View>
  )
}

export default LessonCard
