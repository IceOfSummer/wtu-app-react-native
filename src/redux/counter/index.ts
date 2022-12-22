import { combineReducers } from 'redux'
import userReducer from './wtuUserSlice'
import { PersistConfig } from 'redux-persist/es/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserState } from '../types/wtuUserTypes'
import { persistReducer } from 'redux-persist'
import { LessonsTableStates } from '../types/lessonsTableTypes'
import { CommonOptionsStates } from '../types/commonOptionsTypes'
import lessonsTableReducer from './lessonsTableSlice'
import temporaryData from './temporaryDataSlice'
import commonOptionsReducer from './commonOptionsSlice'
import { TemporaryDataState } from '../types/temporaryDataTypes'
import commonPersistReducer from './commonPersistenceSlice'
import { CommonPersistenceState } from '../types/commonPersistenceTypes'
import { ThemeState } from '../types/themeTypes'
import themeReducer from './themeSlice'
import messageSlice from './messageSlice'
import { MessageState } from '../types/messageTypes'
import { ServerUserState } from '../types/serverUserTypes'
import serverUserSlice from './serverUserSlice'

const userPersistConfig: PersistConfig<UserState> = {
  key: 'user',
  storage: AsyncStorage,
  timeout: 3000,
}

const lessonsTablePersistConfig: PersistConfig<LessonsTableStates> = {
  key: 'lessons',
  storage: AsyncStorage,
  timeout: 3000,
}

const commonOptionsPersistConfig: PersistConfig<CommonOptionsStates> = {
  key: 'commonOptions',
  storage: AsyncStorage,
  timeout: 3000,
}
const commonPersistPConfig: PersistConfig<CommonPersistenceState> = {
  key: 'commonPersist',
  storage: AsyncStorage,
  timeout: 3000,
}

const themePersistConfig: PersistConfig<ThemeState> = {
  key: 'theme',
  storage: AsyncStorage,
  timeout: 3000,
}

const serverUserPersistConfig: PersistConfig<ServerUserState> = {
  key: 'serverUser',
  storage: AsyncStorage,
  blacklist: ['cachedUser'],
  timeout: 3000,
}

const reducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  lessonsTable: persistReducer(lessonsTablePersistConfig, lessonsTableReducer),
  temporary: temporaryData,
  commonOptions: persistReducer(
    commonOptionsPersistConfig,
    commonOptionsReducer
  ),
  commonPersist: persistReducer(commonPersistPConfig, commonPersistReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
  message: messageSlice,
  serverUser: persistReducer(serverUserPersistConfig, serverUserSlice),
})

export type ReducerTypes = {
  user: UserState
  lessonsTable: LessonsTableStates
  temporary: TemporaryDataState
  commonOptions: CommonOptionsStates
  commonPersist: CommonPersistenceState
  theme: ThemeState
  message: MessageState
  serverUser: ServerUserState
}
export default reducer
