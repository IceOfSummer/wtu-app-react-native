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

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 * @return 如: 2022-09-21 23:04
 */
export const formatTimestamp = (timestamp: number | string): string => {
  if (typeof timestamp === 'string') {
    timestamp = Number.parseInt(timestamp, 10)
  }
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${append0Prefix(
    date.getMonth() + 1
  )}-${append0Prefix(date.getDate())} ${append0Prefix(
    date.getHours()
  )}:${append0Prefix(date.getMinutes())}`
}

/**
 * 格式化时间戳
 * - 若时间戳的时间是今天，则不会显示年月日
 * - 若时间戳的时间和当前同一年，则不会显示年份
 * - 若都符合，显示所有时间
 * @param timestamp 时间戳
 * @return 如: 2022-09-21 23:04 根据上述规则进行省略
 */
export const formatTimestampSimply = (timestamp: number): string => {
  const date = new Date(timestamp)
  if (timestamp > getZeroTimestamp()) {
    // 当天
    return `${append0Prefix(date.getHours())}:${append0Prefix(
      date.getMinutes()
    )}`
  }
  if (new Date().getFullYear() === date.getFullYear()) {
    // 同年
    return `${append0Prefix(date.getMonth() + 1)}-${append0Prefix(
      date.getDate()
    )} ${append0Prefix(date.getHours())}:${append0Prefix(date.getMinutes())}`
  }
  return `${date.getFullYear()}-${append0Prefix(
    date.getMonth() + 1
  )}-${append0Prefix(date.getDate())} ${append0Prefix(
    date.getHours()
  )}:${append0Prefix(date.getMinutes())}`
}

/**
 * 一天具有的毫秒数
 */
const DAY_OF_MIL = 24 * 60 * 60 * 1000

/**
 * 获取当天0点0分的时间戳
 */
function getZeroTimestamp(): number {
  const now = new Date()
  const time = now.getTime()
  return time - ((time + now.getTimezoneOffset()) % DAY_OF_MIL)
}
