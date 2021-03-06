import { combineReducers } from 'redux'
import userReducer from './userSlice'
import { PersistConfig } from 'redux-persist/es/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserState } from '../types/userTypes'
import { persistReducer } from 'redux-persist'
import { LessonsTableStates } from '../types/lessonsTableTypes'
import { CommonOptionsStates } from '../types/commonOptionsTypes'
import lessonsTableReducer from './lessonsTableSlice'
import temporaryData from './temporaryDataSlice'
import commonOptionsReducer from './commonOptionsSlice'
import { TemporaryDataState } from '../types/temporaryDataTypes'

const userPersistConfig: PersistConfig<UserState> = {
  key: 'user',
  storage: AsyncStorage,
}

const lessonsTablePersistConfig: PersistConfig<LessonsTableStates> = {
  key: 'lessons',
  storage: AsyncStorage,
}

const commonOptionsPersistConfig: PersistConfig<CommonOptionsStates> = {
  key: 'commonOptions',
  storage: AsyncStorage,
}

const reducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  lessonsTable: persistReducer(lessonsTablePersistConfig, lessonsTableReducer),
  temporary: temporaryData,
  commonOptions: persistReducer(
    commonOptionsPersistConfig,
    commonOptionsReducer
  ),
})

export type ReducerTypes = {
  user: UserState
  lessonsTable: LessonsTableStates
  temporary: TemporaryDataState
  commonOptions: CommonOptionsStates
}

export default reducer
