import {
  BaseQueryParam,
  SubjectQueryParam,
} from '../../../api/edu/subjectSelect'
import { useStore } from 'react-redux'
import { saveGlobalState } from '../../../redux/counter/temporaryDataSlice'
import { ReducerTypes } from '../../../redux/reducers'

const S_S_GLOBAL_PREFIX = 'subjectSelect'
const S_S_K_BASE_QUERY = 'baseQueryParam'

export default function useGlobalState() {
  const store = useStore<ReducerTypes>()

  const getParam = <T>(key: string): T | undefined => {
    const param = store.getState().temporary.globalStates[S_S_GLOBAL_PREFIX]
    return param ? param[key] : undefined
  }

  return {
    setBaseQueryParam(param: BaseQueryParam) {
      store.dispatch(
        saveGlobalState({
          [S_S_GLOBAL_PREFIX]: {
            [S_S_K_BASE_QUERY]: param,
          },
        })
      )
    },
    getBaseQueryParam(): BaseQueryParam | undefined {
      return getParam(S_S_K_BASE_QUERY)
    },
    setSubjectQueryParam(prefix: string, param: SubjectQueryParam) {
      store.dispatch(
        saveGlobalState({
          [S_S_GLOBAL_PREFIX]: {
            [prefix]: param,
          },
        })
      )
    },
    getSubjectQueryParam(prefix: string): SubjectQueryParam | undefined {
      return getParam(prefix)
    },
    clearAll() {
      store.dispatch(
        saveGlobalState({
          [S_S_GLOBAL_PREFIX]: null,
        })
      )
    },
  }
}
