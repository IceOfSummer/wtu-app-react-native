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
  week: number
  /**
   * 当前学年
   */
  year: number
  /**
   * 3: 上学期, 13: 下学期
   */
  term: Term
  /**
   * 当前周的上次更新时间戳, 用于自动更新当前周
   */
  curWeekLastUpdate: number
}

/**
 * 3: 上学期, 12: 下学期
 */
export type Term = 3 | 12

export type ClassWeekDuration = {
  /**
   * 开始周
   */
  startWeek: number

  /**
   * 结束周
   */
  endWeek: number
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
   * 哪几周的课
   */
  weekInfo: Array<ClassWeekDuration>
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
  /**
   * 原始数据
   */
  origin: LessonsOriginData
}

export type LessonsOriginData = {
  /**
   * 上课周
   */
  zcd: string
}
