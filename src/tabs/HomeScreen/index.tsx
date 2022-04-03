import React from 'react'
import { Text, View } from 'react-native'
import PullDownRefreshView from '../../native/component/BounceScrollView'
import { checkUpdate } from 'react-native-update'
import Button from 'react-native-button'
import NativeDialog from '../../native/modules/NativeDialog'

const Index: React.FC = () => {
  checkUpdate('lVc6_awtGU4UdySZkKLufjP1')
    .then(resp => {
      console.log(resp)
    })
    .catch(console.log)

  const test = () => {
    NativeDialog.showDialog({
      title: 'hello',
      message: 'hello world',
      onCancel: () => {
        console.log('cancel')
      },
      onConfirm: () => {
        console.log('confirm')
      },
      hideCancelBtn: true,
    })
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
