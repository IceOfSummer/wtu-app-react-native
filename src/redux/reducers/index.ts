import { combineReducers } from 'redux'
import userReducer, { UserState } from './user'
import lessonsTableReducer from './lessonsTable'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer } from 'redux-persist'
import { LessonsTableStates } from '../types/lessonsTableTypes'
import temporaryData from './temporaryData'
import { TemporaryDataState } from '../types/temporaryDataTypes'
import { PersistConfig } from 'redux-persist/es/types'
import { CommonOptionsStates } from '../types/commonOptionsTypes'
import commonOptionsReducer from './commonOptions'

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

export default combineReducers({
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
