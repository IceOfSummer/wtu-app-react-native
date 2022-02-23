import React from 'react'
import TabBar from './src/tabs'
import { Provider } from 'react-redux'
import store from './src/redux/store'

const App = () => {
  return (
    <Provider store={store().store}>
      <TabBar />
    </Provider>
  )
}

export default App
