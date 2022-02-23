import React from 'react'
import TabBar from './src/tabs'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { PersistGate } from 'redux-persist/lib/integration/react'

const s = store()
const App = () => {
  return (
    <Provider store={s.store}>
      <PersistGate persistor={s.persistor}>
        <TabBar />
      </PersistGate>
    </Provider>
  )
}

export default App
