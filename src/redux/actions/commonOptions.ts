import { Action } from 'redux'
import { CommonOptionActionConstant } from '../constant'
import { CommonOptionsStates } from '../types/commonOptionsTypes'
import { modifyCommonOptions as _modifyCommonOptions } from '../counter/commonOptionsSlice'

export type CommonOptionsActions = ModifyCommonOptionAction

/**
 * ============================
 * 修改配置信息
 * @deprecated
 */
export interface ModifyCommonOptionAction
  extends Action<CommonOptionActionConstant> {
  type: CommonOptionActionConstant.modifyOptions
  data: Partial<CommonOptionsStates>
}

/**
 * @deprecated
 */
export const modifyCommonOptions = _modifyCommonOptions
