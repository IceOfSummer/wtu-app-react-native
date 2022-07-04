import { Action } from 'redux'
import { LessonsTableActionConstant } from '../constant'
import { ClassInfo, LessonTableOptions, Term } from '../types/lessonsTableTypes'
import {
  modifyOptions as _modifyOptions,
  saveLessonsInfo as _saveLessonsInfo,
  updateCurWeek as _updateCurWeek,
} from '../counter/lessonsTableSlice'

export type LessonsTableActions =
  | ModifyOptionsAction
  | SaveLessonsInfoAction
  | UpdateCurWeekAction

/**
 * ====================================
 * 修改课程表设置
 * @deprecated
 */
export interface ModifyOptionsAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.modifyOptions
  data: Partial<LessonTableOptions>
}

/**
 * @deprecated
 * @param data
 */
export const modifyOptions = _modifyOptions

/**
 * =====================================
 * 保存课表信息
 * @deprecated
 */
export interface SaveLessonsInfoAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.saveLessonsInfo
  data: Array<ClassInfo>
}

/**
 * @deprecated
 */
export const saveLessonsInfo = _saveLessonsInfo

/**
 * =====================================
 * 更新当前周
 * @deprecated
 */
export interface UpdateCurWeekAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.updateCurWeek
}

/**
 * @param year
 * @param term
 * @deprecated
 */
export const updateCurWeek = (year: number, term: Term) =>
  _updateCurWeek({ term, year })
