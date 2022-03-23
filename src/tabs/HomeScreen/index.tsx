import React from 'react'
import { Text } from 'react-native'
import PullDownRefreshView, {
  finishRefresh,
} from '../../native/component/PullDownRefreshView'

const Index: React.FC = () => {
  const doRefresh = (finish: finishRefresh) => {
    setTimeout(() => {
      finish()
    }, 2000)
    console.log('refresh')
  }

  return (
    <PullDownRefreshView onRefresh={doRefresh} enableRefresh={true}>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
      <Text>Foot</Text>
    </PullDownRefreshView>
  )
}

export default Index
