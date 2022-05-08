import { Reducer } from 'redux'
import { TemporaryDataState } from '../types/temporaryDataTypes'
import { TemporaryDataActions } from '../actions/temporaryData'
import { TemporaryDataActionConstant } from '../constant'
import { deepCopyObject } from '../../utils/ObjectUtils'

const initTemporaryDataState: TemporaryDataState = {
  isCheckLoginDone: false,
  globalStates: {},
}

/**
 * 存放临时数据, 不做持久化操作
 */
const temporaryData: Reducer<TemporaryDataState, TemporaryDataActions> = (
  state = initTemporaryDataState,
  action
) => {
  if (action.type === TemporaryDataActionConstant.markCheckLoginDone) {
    const copyStates = deepCopyObject(state)
    copyStates.isCheckLoginDone = true
    return copyStates
  } else if (action.type === TemporaryDataActionConstant.saveGlobalState) {
    const copyState = deepCopyObject(state)
    copyState.globalStates = Object.assign(copyState.globalStates, action.data)
  }
  return state
}

export default temporaryData
