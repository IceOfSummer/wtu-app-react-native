import React from 'react'
import { ReducerTypes } from '../../../../redux/counter'
import { connect } from 'react-redux'
import { modifyOptions } from '../../../../redux/counter/lessonsTableSlice'
import { Term } from '../../../../redux/types/lessonsTableTypes'
import { View } from 'react-native'
import CardContainer from '../../../../component/Cards/CardContainer'
import PullDownPickerCard from '../../../../component/Cards/PullDownPickerCard'
import SimpleCard from '../../../../component/Cards/SimpleCard'
import NativeDialog from '../../../../native/modules/NativeDialog'
import BottomMenu from '../../../../native/modules/BottomMenu'
import { useClassScheduleTheme } from '../../../../tabs/ClassScheduleScreen/Theme'
import Loading from '../../../../component/Loading'
import { getCurWeekFromServer } from '../../../../api/edu/classes'
import defaultTheme from '../../../../tabs/ClassScheduleScreen/Theme/defaultTheme'
import remTheme from '../../../../tabs/ClassScheduleScreen/Theme/remTheme'

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

const LessonsTableSettings: React.FC<
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

  const adjustCurWeek = () => {
    NativeDialog.showDialog({
      title: '校准当前周',
      message: '确定要校准当前周吗?',
      onConfirm() {
        Loading.showLoading()
        getCurWeekFromServer(props.year, props.term)
          .then(week => {
            NativeDialog.showDialog({
              title: '校准成功',
              message: `当前为第${week}周`,
              type: 'primary',
              hideCancelBtn: true,
            })
            props.modifyOptions({
              week,
            })
          })
          .catch(e => {
            NativeDialog.showDialog({
              title: '校准失败',
              message: e.toString(),
              type: 'error',
            })
          })
          .finally(() => Loading.hideLoading())
      },
    })
  }

  const termStr = props.term === 3 ? '上学期' : '下学期'

  const theme = useClassScheduleTheme()
  const showCheckThemeDialog = () => {
    BottomMenu.showMenu(['默认主题', '蕾姆主题'], (index, name) => {
      let tarTheme
      if (index === 0) {
        tarTheme = defaultTheme
      } else if (index === 1) {
        tarTheme = remTheme
      } else {
        console.log('unknown theme index: ' + index)
        return
      }
      theme.setTheme(tarTheme)
      const desc = tarTheme.description + '(刷新后生效)'
      NativeDialog.showDialog({
        title: `成功切换为${name}`,
        message: desc ? desc : '暂无描述',
        hideCancelBtn: true,
      })
    })
  }

  return (
    <View style={{ height: '100%' }}>
      <CardContainer>
        <PullDownPickerCard
          title="当前周"
          pickerTitle="选择当前周"
          pickerData={CUR_WEEK_DATA}
          pickerCurrent={props.week}
          onSelect={setCurWeek}
        />
        <PullDownPickerCard
          title="当前学年"
          pickerTitle="选择当前学年"
          pickerData={YEAR_DATA}
          pickerCurrent={props.year}
          onSelect={setCurYear}
        />
        <PullDownPickerCard
          title="当前学期"
          pickerTitle="选择当前学期"
          pickerData={TERM_DATA}
          pickerCurrent={termStr}
          onSelect={setCurTerm}
        />
        <SimpleCard title="切换主题(试验性)" onTap={showCheckThemeDialog} />
        <SimpleCard
          title="校准当前周"
          hideBorder
          onTap={adjustCurWeek}
          type="primary"
        />
      </CardContainer>
    </View>
  )
}

interface StoreProps {
  week: number
  year: number
  term: Term
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
    term: initialState.lessonsTable.options.term!,
  }),
  {
    modifyOptions,
  }
)(LessonsTableSettings)
