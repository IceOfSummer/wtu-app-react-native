import React from 'react'
import { Provider } from 'react-redux'
import redux from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Router from './src/router'
import initInterceptors from './src/api'

initInterceptors()
const App = () => {
  return (
    <Provider store={redux.store}>
      <PersistGate persistor={redux.persistor}>
        <Router />
      </PersistGate>
    </Provider>
  )
}

export default App
