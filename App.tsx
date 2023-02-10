import React, { useEffect, useState } from 'react'
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
import ReLoginWrapper from './src/component/Container/ReLoginWrapper'
import DatabaseManager from './src/sqlite'
import { showSingleBtnTip } from './src/native/modules/NativeDialog'
import AuthorizationGate from './src/component/Container/AuthorizationGate'
import AppEvents from './src/AppEvents'

const logger = getLogger('App')

const App = () => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    logger.info('app launch')
    DatabaseManager.loadDatabase().catch(e => {
      logger.error('load database failed: ' + e.message)
      showSingleBtnTip('加载本地数据库失败', e.message)
    })
    AppEvents.trigger('onAppLaunch')
    AppEvents.subscribeOnce('appDatabaseCheckDone', () => {
      UpdateChecker.checkUpdate()
      setReady(true)
    })
  }, [])
  if (ready) {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthorizationGate>
            <View style={{ flex: 1 }}>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
              />
              <Loading />
              <ReLoginWrapper>
                <Router />
              </ReLoginWrapper>
            </View>
          </AuthorizationGate>
        </PersistGate>
      </Provider>
    )
  } else {
    return null
  }
}

export default App
