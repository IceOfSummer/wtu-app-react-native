import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer, persistStore } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import reducer from './counter'
import { PersistConfig } from 'redux-persist/es/types'

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [''],
}

const persistedReducer = persistReducer(persistConfig, reducer)

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

export const persistor = persistStore(store)
