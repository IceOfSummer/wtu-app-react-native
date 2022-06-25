import { UserState } from '../reducers/user'
import { LessonsTableStates } from './lessonsTableTypes'
import { TemporaryDataState } from './temporaryDataTypes'
import { CommonOptionsStates } from './commonOptionsTypes'

export type ReducerTypes = {
  user: UserState
  lessonsTable: LessonsTableStates
  temporary: TemporaryDataState
  commonOptions: CommonOptionsStates
}
