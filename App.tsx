import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Router from './src/router'
import './src/api'
import './src/api/chat/MessageListener'
import Loading from './src/component/Loading'
import { StatusBar, View } from 'react-native'
import UpdateChecker from './src/utils/UpdateChecker'
import { getLogger } from './src/utils/LoggerUtils'

const logger = getLogger('App')

const App = () => {
  UpdateChecker.checkUpdate()
  useEffect(() => {
    logger.info('app launch')
  }, [])
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <Router />
          <Loading />
        </View>
      </PersistGate>
    </Provider>
  )
}

export default App
