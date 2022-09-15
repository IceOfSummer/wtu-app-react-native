/**
 * 从当前日期中获取标准的星期
 * 1为周一, ... , 7为周日
 */
import { Term } from '../../redux/types/lessonsTableTypes'

export const getStanderDay = (date: Date) => {
  const day = date.getDay()
  if (day === 0) {
    return 7
  } else {
    return day
  }
}

/**
 * 获取当前的星期, 1为周一, ... , 7为周日
 */
export const getCurDay = () => {
  return getStanderDay(new Date())
}

/**
 * 获取当前学期
 */
export const getCurTerm = (): Term => {
  // 1为一月
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 8) {
    // 下学期
    return 12
  } else {
    // 上学期
    return 3
  }
}

export const append0Prefix = (hour: number) => {
  return hour < 10 ? '0' + hour : hour
}
