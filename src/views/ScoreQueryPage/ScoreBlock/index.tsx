import React from 'react'
import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native'
import { SubjectScore } from '../../../api/edu/applications'

interface ScoreBlockProps {
  subjects: Subjects
  onPress?: (subjectScore: SubjectScore) => void
}

export type Subjects = {
  type: string
  subjects: Array<SubjectScore>
}

const ScoreBlock: React.FC<ScoreBlockProps> = props => {
  const getSubjectColor = (subject: SubjectScore): ColorValue => {
    if (subject.origin.bfzcj < 60) {
      return global.styles.$error_color
    } else if (subject.origin.bfzcj < 75) {
      return global.styles.$warning_color
    } else {
      return global.styles.$success_color
    }
  }

  return (
    <View style={styles.blockOuter}>
      <View style={styles.blockContainer}>
        <View>
          <Text style={styles.headerText}>{props.subjects.type}</Text>
        </View>
        <View style={styles.scoreTableContainer}>
          <View style={styles.headerTableContainer}>
            <View style={styles.rowItem}>
              <Text style={[styles.textCenterAlign, { color: '#fff' }]}>
                课程名称
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={[styles.textCenterAlign, { color: '#fff' }]}>
                教师名称
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={[styles.textCenterAlign, { color: '#fff' }]}>
                最终成绩
              </Text>
            </View>
          </View>
          {props.subjects.subjects.map(value => {
            const color = getSubjectColor(value)
            return (
              <Pressable
                onPress={() => props.onPress?.(value)}
                key={value.origin.jxb_id}
                style={styles.rowContainer}>
                <View style={styles.rowItem}>
                  <Text style={[styles.textCenterAlign, { color }]}>
                    {value.subjectName}
                  </Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={[styles.textCenterAlign, { color }]}>
                    {value.teacherName}
                  </Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={[styles.textCenterAlign, { color }]}>
                    {value.score}
                  </Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scoreTableContainer: {
    backgroundColor: 'rgba(227,227,227,0.1)',
    borderRadius: 8,
  },
  headerTableContainer: {
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: global.styles.$primary_color,
    fontSize: global.styles.$font_size_lg,
    textAlign: 'left',
    marginVertical: 8,
  },
  blockOuter: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  blockContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowItem: {
    width: '33%',
    paddingVertical: 10,
    borderColor: global.styles.$border_color,
    justifyContent: 'center',
  },
  textCenterAlign: {
    textAlign: 'center',
  },
})

export default ScoreBlock
