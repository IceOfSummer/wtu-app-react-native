import { Reducer } from 'redux'
import { CommonOptionsStates } from '../types/commonOptionsTypes'
import { CommonOptionsActions } from '../actions/commonOptions'
import { CommonOptionActionConstant } from '../constant'
import { deepCopyObject } from '../../utils/ObjectUtils'

const initState: CommonOptionsStates = {
  autoHideSubjectSelectPageTips: false,
}

const commonOptionsReducer: Reducer<
  CommonOptionsStates,
  CommonOptionsActions
> = (state = initState, action) => {
  if (action.type === CommonOptionActionConstant.modifyOptions) {
    return Object.assign(deepCopyObject(state), action.data)
  }
  return state
}

export default commonOptionsReducer
