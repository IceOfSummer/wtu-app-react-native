import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Term } from '../../redux/types/lessonsTableTypes'
import { getCurTerm } from '../../utils/DateUtils'
import { queryStudentScore, SubjectScore } from '../../api/edu/applications'
import ScoreBlock, { Subjects } from './ScoreBlock'
import Loading from '../../component/Loading'
import NativeDialog from '../../native/modules/NativeDialog'
import ScoreDetailDrawerContent from './ScoreDetailDrawerContent'
import Icons from '../../component/Icons'
import Drawer from '../../component/Drawer'
import { SpringScrollView } from 'react-native-spring-scrollview'
import Picker from '../../component/Drawer/Picker'
import { ReducerTypes } from '../../redux/counter'

const curYear = new Date().getFullYear()
const TERM_STR = [
  `${curYear - 4}年上学期`,
  `${curYear - 4}年下学期`,
  `${curYear - 3}年上学期`,
  `${curYear - 3}年下学期`,
  `${curYear - 2}年上学期`,
  `${curYear - 2}年下学期`,
  `${curYear - 1}年上学期`,
  `${curYear - 1}年下学期`,
  `${curYear}年上学期`,
  `${curYear}年下学期`,
  `${curYear + 1}年上学期`,
  `${curYear + 1}年下学期`,
]

const TIME_SCHEMA: Array<Time> = [
  { term: 3, year: curYear - 4 },
  { term: 12, year: curYear - 4 },
  { term: 3, year: curYear - 3 },
  { term: 12, year: curYear - 3 },
  { term: 3, year: curYear - 2 },
  { term: 12, year: curYear - 2 },
  { term: 3, year: curYear - 1 },
  { term: 12, year: curYear - 1 },
  { term: 3, year: curYear },
  { term: 12, year: curYear },
  { term: 3, year: curYear + 1 },
  { term: 12, year: curYear + 1 },
]
type Time = {
  term: Term
  year: number
}

let defaultSelectIndex: number
if (getCurTerm() === 3) {
  defaultSelectIndex = 7
} else {
  defaultSelectIndex = 6
}

type ScoreList = Array<Subjects>

const ScoreQueryPage: React.FC<StoreStates & StoreActions> = props => {
  const [curSelectIndex, setSelectIndex] = useState(defaultSelectIndex)
  const [scores, setScores] = useState<ScoreList>([])
  const [curTapSubject, setCurTapSubject] = useState<SubjectScore>()
  const scoreDetailDrawer = useRef<Drawer>(null)
  const termDrawer = useRef<Drawer>(null)

  const onSelect = (index: number) => {
    setSelectIndex(index)
    termDrawer.current?.closeDrawer()
  }

  /**
   * 监听学期切换
   */
  useEffect(() => {
    const time = TIME_SCHEMA[curSelectIndex]
    Loading.showLoading()
    queryStudentScore(props.id, time.year, time.term)
      .then(resp => {
        // 课程分类
        const map = new Map<string, Array<SubjectScore>>()
        resp.forEach(value => {
          const type = value.type
          const arr = map.get(type)
          if (arr) {
            arr.push(value)
          } else {
            map.set(type, [value])
          }
        })

        const scoresArr: ScoreList = []
        map.forEach((arr, key) => {
          arr.sort((a, b) => b.origin.bfzcj - a.origin.bfzcj)
          scoresArr.push({
            type: key,
            subjects: arr,
          })
        })
        setScores(scoresArr)
      })
      .catch(e =>
        NativeDialog.showDialog({
          title: '加载课表失败',
          message: e,
          hideCancelBtn: true,
        })
      )
      .finally(() => {
        Loading.hideLoading()
      })
  }, [curSelectIndex])

  const subjectPressEvent = (subjectScore: SubjectScore) => {
    setCurTapSubject(subjectScore)
    scoreDetailDrawer.current?.showDrawer()
  }

  const showTermPicker = () => {
    termDrawer.current?.showDrawer()
  }
  return (
    <SpringScrollView>
      <Pressable
        onPress={showTermPicker}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Icons iconText="&#xe6b9;" />
        <Text>{TERM_STR[curSelectIndex]}</Text>
      </Pressable>
      <View style={styles.container}>
        {scores.map((value, index) => (
          <ScoreBlock
            onPress={subjectPressEvent}
            subjects={value}
            key={index}
          />
        ))}
        <Text style={styles.tipText}>
          {scores.length === 0
            ? '没有查询到相关成绩哦'
            : ' 成绩大于等于75分用绿色标记, 60分到75分为橙色, 小于60分为红色'}
        </Text>
      </View>
      <Drawer ref={scoreDetailDrawer} style={styles.detailDrawer}>
        <ScoreDetailDrawerContent subject={curTapSubject} />
      </Drawer>
      <Drawer ref={termDrawer}>
        <Picker
          items={TERM_STR}
          title="选择学期"
          initSelect={curSelectIndex}
          onSelect={onSelect}
        />
      </Drawer>
    </SpringScrollView>
  )
}

const styles = StyleSheet.create({
  tipText: {
    fontSize: global.styles.$font_size_sm,
    textAlign: 'center',
  },
  container: {
    paddingBottom: 50,
  },
  detailDrawer: {
    height: Dimensions.get('window').height / 1.2,
  },
})

interface StoreStates {
  id: string
}

interface StoreActions {}

export default connect<StoreStates, StoreActions, {}, ReducerTypes>(
  initialState => ({
    // 因为不登录不让进，肯定是存在的
    id: initialState.user.username!,
  })
)(ScoreQueryPage)
