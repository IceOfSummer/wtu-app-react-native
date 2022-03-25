import { Reducer } from 'redux'
import { LessonsTableActions } from '../actions/lessonsTable'
import { LessonsTableActionConstant } from '../constant'

export interface LessonsTableStates {
  options: LessonTableOptions
  lessons?: Array<ClassInfo>
}

/**
 * <b>为了修改时方便，所有属性都是可选的。但所有配置一点要初始化</b>
 */
export type LessonTableOptions = {
  /**
   * 当前周
   */
  week?: number
  /**
   * 当前学年
   */
  year?: number
  /**
   * 3: 上学期, 13: 下学期
   */
  term?: 3 | 12
}
/**
 * 课程信息
 */
export type ClassInfo = {
  /**
   * 课程号id
   */
  id: string
  /**
   * 上课开始时间
   */
  beginTime: number
  /**
   * 上几节课(1节课45min)
   */
  duration: number
  /**
   * 星期几的课
   */
  week: number
  /**
   * 课程名称
   */
  className: string
  /**
   * 上课地点
   */
  location: string
  /**
   * 开始周
   */
  startWeek: number
  /**
   * 结束周
   */
  endWeek: number
  /**
   * 教师姓名
   */
  teacher: string
  /**
   * 课程组成: '讲课: xx, 实验: xx'
   */
  contains: string
  /**
   * 考试类型
   */
  examType: string
  /**
   * 课程类型
   */
  lessonsType: string
}

const initState: LessonsTableStates = {
  options: {
    week: 1,
    year: new Date().getFullYear(),
    term: 3,
  },
}

const lessonsTableReducer: Reducer<LessonsTableStates, LessonsTableActions> = (
  state = initState,
  action
) => {
  const copyObj = JSON.parse(JSON.stringify(state)) as LessonsTableStates
  if (action.type === LessonsTableActionConstant.modifyOptions) {
    Object.assign(copyObj.options, action.data)
    return copyObj
  } else if (action.type === LessonsTableActionConstant.saveLessonsInfo) {
    copyObj.lessons = action.data
    return copyObj
  }
  return state
}

export default lessonsTableReducer
