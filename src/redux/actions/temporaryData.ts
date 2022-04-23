import { Action } from 'redux'
import { TemporaryDataActionConstant } from '../constant'

export type TemporaryDataActions = MarkCheckLoginDoneAction

/**
 * ==================================================
 * 标记检查登录完成
 */
export interface MarkCheckLoginDoneAction
  extends Action<TemporaryDataActionConstant> {
  type: TemporaryDataActionConstant.markCheckLoginDone
}
export const markCheckLoginDone = (): MarkCheckLoginDoneAction => ({
  type: TemporaryDataActionConstant.markCheckLoginDone,
})
