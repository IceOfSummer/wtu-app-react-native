import './src/global/globalVariables'
import { AppRegistry, DevSettings } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import SQLite from 'react-native-sqlite-storage'
import { login } from './src/api/server/auth'
import './src/utils/LoggerUtils/index'
import { store } from './src/redux/store'
import { saveUserToCache } from './src/redux/counter/serverUserSlice'
import DatabaseManager from './src/sqlite'

SQLite.enablePromise(true)
AppRegistry.registerComponent(appName, () => App)

/**
 * 快速登录
 */
if (__DEV__) {
  DevSettings.addMenuItem('login test account1', () => {
    login('100000', 'abc123').then(resp => {
      console.log(resp)
    })
  })
  DevSettings.addMenuItem('login test account2', () => {
    login('100001', 'abc123').then(resp => {
      console.log(resp)
    })
  })
  DevSettings.addMenuItem('insert users', () => {
    for (let i = 4; i < 10; ++i) {
      store.dispatch(
        saveUserToCache({
          uid: i,
          nickname: 'Name-' + i,
        })
      )
    }
  })
  DevSettings.addMenuItem('test sql', () => {
    DatabaseManager.executeSql('SELECT * FROM last_message').then(result => {
      console.log(result[0].rows.raw())
    })
    DatabaseManager.executeSql('SELECT * FROM message').then(result => {
      console.log(result[0].rows.raw())
    })
  })
}
