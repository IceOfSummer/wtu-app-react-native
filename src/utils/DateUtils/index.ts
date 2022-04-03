/**
 * 从当前日期中获取标准的星期
 * 1为周一, ... , 7为周日
 */
export const getStanderDay = (date: Date) => {
  const day = date.getDay()
  if (day === 0) {
    return 7
  } else {
    return day - 1
  }
}

/**
 * 获取当前的星期, 1为周一, ... , 7为周日
 */
export const getCurDay = () => {
  return getStanderDay(new Date())
}
