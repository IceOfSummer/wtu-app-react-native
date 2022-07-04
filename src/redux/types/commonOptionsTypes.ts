import { ClassScheduleTheme } from '../../tabs/ClassScheduleScreen/Theme'
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice'
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

export interface CommonOptionsStates {
  /**
   * 不再显示选课工具的提醒
   */
  autoHideSubjectSelectPageTips: boolean
  /**
   * 当前正激活的课程表主题
   */
  activeClassScheduleTheme?: ClassScheduleTheme
}

export interface CommonOptionsReducers
  extends SliceCaseReducers<CommonOptionsStates> {
  /**
   * 修改配置信息
   */
  modifyCommonOptions: CaseReducer<
    CommonOptionsStates,
    PayloadAction<Partial<CommonOptionsStates>>
  >
}
