import React from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Router from './src/router'
import './src/api'
import Loading from './src/component/Loading'
import { SafeAreaView } from 'react-native'
import useUpdateCheck from './src/hook/useUpdateCheck'

const App = () => {
  useUpdateCheck()
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <Router />
          <Loading />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  )
}

export default App
