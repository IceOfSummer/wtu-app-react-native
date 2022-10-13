import './src/global/globalVariables'
import { AppRegistry, DevSettings } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import SQLite from 'react-native-sqlite-storage'
import { login } from './src/api/server/auth'
import './src/utils/LoggerUtils/index'

SQLite.enablePromise(true)
AppRegistry.registerComponent(appName, () => App)

/**
 * 快速登录
 */
if (__DEV__) {
  DevSettings.addMenuItem('login test account1', () => {
    login('123456', 'abc123').then(resp => {
      console.log(resp)
    })
  })
  DevSettings.addMenuItem('login test account2', () => {
    login('654321', 'abc123').then(resp => {
      console.log(resp)
    })
  })
}
