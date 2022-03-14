import { applyMiddleware, createStore } from 'redux'
import reducer from './reducers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = __DEV__
  ? createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
  : createStore(persistedReducer, applyMiddleware(thunk))

export const persistor = persistStore(store)
