import './src/global/globalVariables'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import WrapperComponent from './src/wrapperComponent'

AppRegistry.setWrapperComponentProvider(() => WrapperComponent)
AppRegistry.registerComponent(appName, () => App)
