import { createStore } from 'redux'
import reducer from './reducers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer, persistStore } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

export default (() => {
  const store = createStore(persistedReducer)
  // @ts-ignore
  const persistor = persistStore(store)
  return { store, persistor }
})()
