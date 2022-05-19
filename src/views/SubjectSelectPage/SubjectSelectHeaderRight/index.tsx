import React from 'react'
import { Pressable } from 'react-native'
import Icons from '../../../component/Icons'
import BottomMenu from '../../../native/modules/BottomMenu'
import PubSub from 'pubsub-js'
import {
  BROAD_OPEN_DIALOG_TIP,
  S_S_GLOBAL_PREFIX,
  S_S_K_BASE_QUERY,
} from '../index'
import NativeDialog from '../../../native/modules/NativeDialog'
import { useStore } from 'react-redux'
import { saveGlobalState } from '../../../redux/actions/temporaryData'
import { S_S_ELECTIVES_S_K, S_S_ENGLISH_S_K, S_S_PE_S_K } from '../Tabs'
import { useNavigation } from '@react-navigation/native'
import { RouterTypes } from '../../../router'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import { SUBJECT_CACHE_PREFIX } from '../Tabs/SubjectList'
import Toast from 'react-native-toast-message'

const SubjectSelectHeaderRight: React.FC = () => {
  const store = useStore()
  const navigation = useNavigation<NavigationProp<RouterTypes>>()
  const showBottomMenu = () => {
    BottomMenu.showMenu(
      [
        '帮助',
        '清除所有缓存',
        '清除基础查询参数缓存',
        '清除选修课选课缓存',
        '清除英语分项选课缓存',
        '清除体育课选课缓存',
        '清除课程独立缓存',
      ],
      (index, text) => {
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
              switch (index) {
                case 1:
                  store.dispatch(
                    saveGlobalState({
                      [S_S_GLOBAL_PREFIX]: null,
                      [SUBJECT_CACHE_PREFIX]: null,
                    })
                  )
                  break
                case 2:
                  store.dispatch(
                    saveGlobalState({
                      [S_S_GLOBAL_PREFIX]: {
                        [S_S_K_BASE_QUERY]: null,
                      },
                    })
                  )
                  break
                case 3:
                  store.dispatch(
                    saveGlobalState({
                      [S_S_GLOBAL_PREFIX]: {
                        [S_S_ELECTIVES_S_K]: null,
                      },
                    })
                  )
                  break
                case 4:
                  store.dispatch(
                    saveGlobalState({
                      [S_S_GLOBAL_PREFIX]: {
                        [S_S_ENGLISH_S_K]: null,
                      },
                    })
                  )
                  break
                case 5:
                  store.dispatch(
                    saveGlobalState({
                      [S_S_GLOBAL_PREFIX]: {
                        [S_S_PE_S_K]: null,
                      },
                    })
                  )
                  break
                case 6:
                  store.dispatch(
                    saveGlobalState({
                      [SUBJECT_CACHE_PREFIX]: null,
                    })
                  )
              }
            },
          })
        }
      }
    )
  }
  return (
    <Pressable onPress={showBottomMenu}>
      <Icons iconText="&#xe8af;" size={25} />
    </Pressable>
  )
}

export default SubjectSelectHeaderRight
