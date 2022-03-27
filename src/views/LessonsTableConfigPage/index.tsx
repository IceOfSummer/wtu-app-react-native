import React from 'react'
import { View } from 'react-native'
import SimpleCard from '../../component/Cards/SimpleCard'
import { connect } from 'react-redux'
import { ReducerTypes } from '../../redux/reducers'
import { modifyOptions } from '../../redux/actions/lessonsTable'
import PullDownPicker from '../../component/PullDownPicker'
import CardContainer from '../../component/Cards/CardContainer'

interface LessonsTableConfigPageProps {}

const curYear = new Date().getFullYear()

const YEAR_DATA = [
  curYear - 3,
  curYear - 2,
  curYear - 1,
  curYear,
  curYear + 1,
  curYear + 2,
  curYear + 3,
]
const CUR_WEEK_DATA = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
]
const TERM_DATA = ['上学期', '下学期']

const LessonsTableConfigPage: React.FC<
  LessonsTableConfigPageProps & StoreActions & StoreProps
> = props => {
  const setCurWeek = (index: number) =>
    props.modifyOptions({
      week: CUR_WEEK_DATA[index],
    })

  const setCurYear = (index: number) =>
    props.modifyOptions({
      year: YEAR_DATA[index],
    })

  const setCurTerm = (index: number) =>
    props.modifyOptions({
      term: index === 0 ? 3 : 12,
    })
  return (
    <CardContainer>
      <SimpleCard
        title="当前周"
        right={
          <View>
            <PullDownPicker
              title="选择当前周"
              data={CUR_WEEK_DATA}
              current={props.week}
              onSelect={setCurWeek}
            />
          </View>
        }
      />
      <SimpleCard
        title="当前学年"
        right={
          <View>
            <PullDownPicker
              title="选择当前学年"
              data={YEAR_DATA}
              current={props.year}
              onSelect={setCurYear}
            />
          </View>
        }
      />
      <SimpleCard
        title="当前学期"
        hideBorder
        right={
          <View>
            <PullDownPicker
              title="选择当前学期"
              data={TERM_DATA}
              current={props.term}
              onSelect={setCurTerm}
            />
          </View>
        }
      />
    </CardContainer>
  )
}

interface StoreProps {
  week: number
  year: number
  term: '上学期' | '下学期'
}
interface StoreActions {
  modifyOptions: (...args: Parameters<typeof modifyOptions>) => void
}

export default connect<
  StoreProps,
  StoreActions,
  LessonsTableConfigPageProps,
  ReducerTypes
>(
  initialState => ({
    week: initialState.lessonsTable.options.week!,
    year: initialState.lessonsTable.options.year!,
    term: initialState.lessonsTable.options.term! === 3 ? '上学期' : '下学期',
  }),
  {
    modifyOptions,
  }
)(LessonsTableConfigPage)
