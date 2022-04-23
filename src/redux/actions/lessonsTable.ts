import { Action, Dispatch } from 'redux'
import { LessonsTableActionConstant } from '../constant'
import { ClassInfo, LessonTableOptions, Term } from '../types/lessonsTableTypes'
import { getCurWeekFromServer } from '../../api/edu/classes'

export type LessonsTableActions =
  | ModifyOptionsAction
  | SaveLessonsInfoAction
  | UpdateCurWeekAction

/**
 * ====================================
 * 修改课程表设置
 */
export interface ModifyOptionsAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.modifyOptions
  data: Partial<LessonTableOptions>
}
export const modifyOptions = (
  data: Partial<LessonTableOptions>
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

/**
 * =====================================
 * 更新当前周
 */
export interface UpdateCurWeekAction
  extends Action<LessonsTableActionConstant> {
  type: LessonsTableActionConstant.updateCurWeek
}

export const updateCurWeek = (year: number, term: Term) =>
  ((dispatch: Dispatch<ModifyOptionsAction | UpdateCurWeekAction>) => {
    getCurWeekFromServer(year, term)
      .then(resp =>
        dispatch({
          type: LessonsTableActionConstant.modifyOptions,
          data: {
            week: resp,
          },
        })
      )
      .catch(() =>
        dispatch({
          type: LessonsTableActionConstant.updateCurWeek,
        })
      )
  }) as unknown as ModifyOptionsAction | UpdateCurWeekAction
