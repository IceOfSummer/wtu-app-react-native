import React from 'react'
import { Button, Text, View } from 'react-native'
import Loading from '../../component/Loading'

const Applications: React.FC = () => {
  return (
    <View>
      <Button title="show loading" onPress={() => Loading.showLoading()} />
      <Text>应用1</Text>
    </View>
  )
}

export default Applications
