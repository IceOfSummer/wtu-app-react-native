import { Action } from 'redux'
import { TemporaryDataActionConstant } from '../constant'

export type TemporaryDataActions =
  | MarkCheckLoginDoneAction
  | SaveGlobalStateAction<Record<string, any>>

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

/**
 * ==================================================
 * 保存全局临时状态
 */
export interface SaveGlobalStateAction<T extends Record<string, any>>
  extends Action<TemporaryDataActionConstant> {
  type: TemporaryDataActionConstant.saveGlobalState
  data: T
}

/**
 * 用于connect函数
 */
export interface SaveGlobalStateFunctionType<T extends Record<string, any>> {
  (data: T): void
}

interface _SaveGlobalStateFunctionType {
  (
    ...args: Parameters<SaveGlobalStateFunctionType<Record<string, any>>>
  ): SaveGlobalStateAction<any>
}

export const saveGlobalState: _SaveGlobalStateFunctionType = data => ({
  type: TemporaryDataActionConstant.saveGlobalState,
  data,
})
