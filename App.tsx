import React from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Router from './src/router'
import initInterceptors from './src/api'
import Loading from './src/component/Loading'
import { simpleUpdate } from 'react-native-update'
import { SafeAreaView } from 'react-native'

initInterceptors()
const App = () => {
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

export default simpleUpdate(App)
