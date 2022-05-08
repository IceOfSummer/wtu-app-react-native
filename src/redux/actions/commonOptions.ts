import { Action } from 'redux'
import { CommonOptionActionConstant } from '../constant'
import { CommonOptionsStates } from '../types/commonOptionsTypes'

export type CommonOptionsActions = ModifyCommonOptionAction

/**
 * ============================
 * 修改配置信息
 */
export interface ModifyCommonOptionAction
  extends Action<CommonOptionActionConstant> {
  type: CommonOptionActionConstant.modifyOptions
  data: Partial<CommonOptionsStates>
}

export const modifyCommonOptions = (
  data: Partial<CommonOptionsStates>
): ModifyCommonOptionAction => ({
  type: CommonOptionActionConstant.modifyOptions,
  data,
})
