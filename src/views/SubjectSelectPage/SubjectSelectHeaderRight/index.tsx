import React from 'react'
import { Pressable } from 'react-native'
import Icons from '../../../component/Icons'
import BottomMenu from '../../../native/modules/BottomMenu'
import PubSub from 'pubsub-js'
import { BROAD_OPEN_DIALOG_TIP } from '../index'
import NativeDialog from '../../../native/modules/NativeDialog'
import { useNavigation } from '@react-navigation/native'
import { RouterTypes } from '../../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import Toast from 'react-native-toast-message'
import useGlobalState from '../useGlobalState'

const SubjectSelectHeaderRight: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RouterTypes>>()
  const globalState = useGlobalState()
  const showBottomMenu = () => {
    BottomMenu.showMenu(['帮助', '清除缓存'], (index, text) => {
      if (index === undefined || text === undefined) {
        return
      }
      if (index === 0) {
        console.log('help')
        PubSub.publish(BROAD_OPEN_DIALOG_TIP)
      } else {
        NativeDialog.showDialog({
          title: '清除缓存',
          message: `确定要 ${text} 吗?`,
          onConfirm() {
            if (navigation.canGoBack()) {
              navigation.goBack()
              Toast.show({
                text1: '清除成功',
                text2: '请重新进入工具',
              })
            }
            // clear cache
            globalState.clearAll()
          },
        })
      }
    })
  }
  return (
    <Pressable onPress={showBottomMenu}>
      <Icons iconText="&#xe8af;" size={25} />
    </Pressable>
  )
}

export default SubjectSelectHeaderRight
