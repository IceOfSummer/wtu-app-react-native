import { AnyAction, configureStore, PayloadAction } from '@reduxjs/toolkit'
import reducer from './counter'
import PubSub from 'pubsub-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PersistConfig } from 'redux-persist/es/types'
import { persistReducer, persistStore } from 'redux-persist'

const RESET_REDUX_ACTION = 'ResetRedux'

export const resetReduxAction = (): PayloadAction => {
  return {
    type: RESET_REDUX_ACTION,
    payload: undefined,
  }
}

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [''],
}

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === RESET_REDUX_ACTION) {
    state = undefined
  }
  return reducer(state, action)
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const arr = getDefaultMiddleware({
      serializableCheck: false,
    })
    if (__DEV__) {
      return [arr[1]]
    } else {
      return arr
    }
  },
})

// export const store = __DEV__
//   ? createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
//   : createStore(persistedReducer, applyMiddleware(thunk))

const PUBSUB_KEY = 'ReduxStoreDispatch'

PubSub.subscribe(PUBSUB_KEY, (message, data) => {
  store.dispatch(data)
})

export const persistor = persistStore(store)
