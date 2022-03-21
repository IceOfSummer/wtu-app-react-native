import { Action } from 'redux'
import { LessonsTableActionConstant } from '../constant'
import { ClassInfo, LessonTableOptions } from '../reducers/lessonsTable'

export type LessonsTableActions = ModifyOptionsAction | SaveLessonsInfoAction

/**
 * ====================================
 * 修改课程表设置
 */
export interface ModifyOptionsAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.modifyOptions
  data: LessonTableOptions
}
export const modifyOptions = (
  data: LessonTableOptions
): ModifyOptionsAction => ({
  type: LessonsTableActionConstant.modifyOptions,
  data,
})
/**
 * =====================================
 * 保存课表信息
 */
export interface SaveLessonsInfoAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.saveLessonsInfo
  data: Array<ClassInfo>
}
export const saveLessonsInfo = (
  data: Array<ClassInfo>
): SaveLessonsInfoAction => ({
  type: LessonsTableActionConstant.saveLessonsInfo,
  data,
})
