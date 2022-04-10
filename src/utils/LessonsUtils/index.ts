import { ClassInfo } from '../../redux/reducers/lessonsTable'
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
    if (
      value.week === curDay &&
      value.startWeek <= week &&
      week <= value.endWeek
    ) {
      arr.push(value)
    }
  })
  return arr
}
