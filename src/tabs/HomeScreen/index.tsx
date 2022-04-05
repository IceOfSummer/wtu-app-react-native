import React from 'react'
import { Text, View } from 'react-native'
import PullDownRefreshView from '../../native/component/BounceScrollView'
import { checkUpdate } from 'react-native-update'
import Button from 'react-native-button'
import { useNavigation } from '@react-navigation/native'
import { RouterTypes, WEB_PAGE } from '../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

const Index: React.FC = () => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  checkUpdate('lVc6_awtGU4UdySZkKLufjP1')
    .then(resp => {
      console.log(resp)
    })
    .catch(console.log)

  const test = () => {
    nav.navigate(WEB_PAGE, { url: 'http://www.baidu.com' })
  }
  return (
    <PullDownRefreshView>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>欢迎来到武纺智联</Text>
        <Text>目前为测试版本</Text>
        <Text>预计在2022年的6月之前完成所有功能!</Text>
      </View>
      <Button onPress={test}>测试</Button>
    </PullDownRefreshView>
  )
}

export default Index
