import React from 'react'
import { Text, View } from 'react-native'
import PullDownRefreshView from '../../native/component/BounceScrollView'

const Index: React.FC = () => {
  return (
    <PullDownRefreshView>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>欢迎来到武纺智联</Text>
        <Text>目前为测试版本</Text>
        <Text>大部分功能仍未完成, 预计在2022年的6月之前完成所有功能!</Text>
      </View>
    </PullDownRefreshView>
  )
}

export default Index
