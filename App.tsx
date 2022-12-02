import React from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Router from './src/router'
import './src/api'
import './src/api/chat/MessageListener'
import Loading from './src/component/Loading'
import { SafeAreaView } from 'react-native'
import UpdateChecker from './src/utils/UpdateChecker'

const App = () => {
  UpdateChecker.checkUpdate()

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
