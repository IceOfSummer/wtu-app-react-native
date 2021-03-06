import { Action } from 'redux'
import { TemporaryDataActionConstant } from '../constant'
import {
  markCheckLoginDone as _markCheckLoginDone,
  saveGlobalState as _saveGlobalState,
} from '../counter/temporaryDataSlice'

export type TemporaryDataActions =
  | MarkCheckLoginDoneAction
  | SaveGlobalStateAction<Record<string, any>>

/**
 * ==================================================
 * 标记检查登录完成
 * @deprecated
 */
export interface MarkCheckLoginDoneAction
  extends Action<TemporaryDataActionConstant> {
  type: TemporaryDataActionConstant.markCheckLoginDone
}

/**
 * @deprecated
 * @see _markCheckLoginDone
 */
export const markCheckLoginDone = _markCheckLoginDone

/**
 * ==================================================
 * 保存全局临时状态
 * @deprecated
 */

export type GlobalStateAvailableTypes =
  | Record<string, any>
  | string
  | number
  | Array<unknown>

/**
 * @deprecated
 */
export interface SaveGlobalStateAction<
  T extends Record<string, D>,
  D = GlobalStateAvailableTypes
> extends Action<TemporaryDataActionConstant> {
  type: TemporaryDataActionConstant.saveGlobalState
  data: T
}

/**
 * 用于connect函数
 * 存入globalState的对象格式必须为:
 * {
 *   state_prefix: {
 *     key1: value1,
 *     key2: value2
 *   }
 * }
 * 或者直接存入基本数据类型, 使用泛型指定即可
 * {
 *   state_prefix: 123
 * }
 */
export interface SaveGlobalStateFunctionType<
  T extends Record<string, D>,
  D = GlobalStateAvailableTypes
> {
  (data: T): void
}

// interface _SaveGlobalStateFunctionType<
//   T extends Record<string, GlobalStateAvailableTypes>
// > {
//   (
//     ...args: Parameters<SaveGlobalStateFunctionType<T>>
//   ): SaveGlobalStateAction<any>
// }

// export const saveGlobalState = <D = Record<string, GlobalStateAvailableTypes>>(
//   data: Partial<D>
// ) => ({
//   type: TemporaryDataActionConstant.saveGlobalState,
//   data,
// })
/**
 * @deprecated
 */
export const saveGlobalState = _saveGlobalState
