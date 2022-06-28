import { ClassInfo } from '../../redux/types/lessonsTableTypes'
import { getCurDay } from '../DateUtils'

export function splitTodayLessons(
  week: number,
  lessons?: Array<ClassInfo>
): Array<ClassInfo> {
  if (!lessons) {
    return []
  }
  const arr: Array<ClassInfo> = []
  const curDay = getCurDay()
  lessons.forEach(value => {
    if (value.week === curDay) {
      value.weekInfo.forEach(info => {
        if (info.startWeek <= week && week <= info.endWeek) {
          arr.push(value)
        }
      })
    }
  })
  return arr
}

/**
 * 该枚举类也被用于优先级
 */
export enum SubjectStatus {
  /**
   * 结课
   */
  ended,
  /**
   * 课程未开始
   */
  notStarted,
  /**
   * 正在上
   */
  active,
}

/**
 * 获取课程状态
 * @param lesson 课程
 * @param curWeek 当前周
 * @see SubjectStatus
 */
export function getSubjectStatus(
  lesson: ClassInfo,
  curWeek: number
): SubjectStatus {
  for (let i = 0, len = lesson.weekInfo.length; i < len; i++) {
    const weekInfo = lesson.weekInfo[i]
    if (weekInfo.startWeek <= curWeek && curWeek <= weekInfo.endWeek) {
      // 正在上
      return SubjectStatus.active
    }
  }
  if (curWeek < lesson.weekInfo[0].startWeek) {
    // 课程还没开始
    return SubjectStatus.notStarted
  } else {
    // 结课
    return SubjectStatus.ended
  }
}
