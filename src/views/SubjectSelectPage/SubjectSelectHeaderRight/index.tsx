import React, { useRef } from 'react'
import { Pressable } from 'react-native'
import Icons from '../../../component/Icons'
import PubSub from 'pubsub-js'
import { BROAD_OPEN_DIALOG_TIP } from '../index'
import NativeDialog from '../../../native/modules/NativeDialog'
import { useNavigation } from '@react-navigation/native'
import { RouterTypes } from '../../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import Toast from 'react-native-toast-message'
import useGlobalState from '../useGlobalState'
import BottomMenu, { MenuItem } from '../../../component/Drawer/BottomMenu'
import Drawer from '../../../component/Drawer'

const menuItems: Array<MenuItem> = [
  { name: '帮助', icon: '&#xe601;' },
  { name: '清除缓存', icon: '&#xe645;' },
]

const SubjectSelectHeaderRight: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RouterTypes>>()
  const globalState = useGlobalState()
  const drawer = useRef<Drawer>(null)
  const showBottomMenu = () => {
    drawer.current?.showDrawer()
  }

  const onSelect = (index: number) => {
    drawer.current?.closeDrawer()
    if (index === 0) {
      PubSub.publish(BROAD_OPEN_DIALOG_TIP)
    } else {
      NativeDialog.showDialog({
        title: '清除缓存',
        message: '确定要清除缓存吗?',
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
  }
  return (
    <Pressable onPress={showBottomMenu}>
      <Icons iconText="&#xe8af;" size={25} />
      <Drawer ref={drawer}>
        <BottomMenu onSelect={onSelect} items={menuItems} title="选项" />
      </Drawer>
    </Pressable>
  )
}

export default SubjectSelectHeaderRight
