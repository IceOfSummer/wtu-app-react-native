import React from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Router from './src/router'
import Toast from 'react-native-toast-message'

const s = store()
const App = () => {
  return (
    <Provider store={s.store}>
      <PersistGate persistor={s.persistor}>
        <Router />
        <Toast />
      </PersistGate>
    </Provider>
  )
}

export default App
