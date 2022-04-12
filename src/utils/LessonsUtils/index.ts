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
