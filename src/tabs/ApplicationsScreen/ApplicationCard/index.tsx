import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { RouterTypes, SCHOOL_AUTH } from '../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import styles from './styles'
import { useStore } from 'react-redux'
import { ReducerTypes } from '../../../redux/reducers'
import NativeDialog from '../../../native/modules/NativeDialog'

interface ApplicationCardProps {
  title: string
  applications: Array<Application>
}

export interface Application<
  P extends keyof RouterTypes = keyof RouterTypes,
  T = RouterTypes[P]
> {
  /**
   * 图片资源, 使用require导入
   */
  image: any
  title: string
  path: P
  routeParams?: T
  needLogin?: boolean
}

const ApplicationCard: React.FC<ApplicationCardProps> = props => {
  const store = useStore<ReducerTypes>()
  const nav = useNavigation<NavigationProp<RouterTypes>>()

  const pressEvent = (app: Application) => {
    if (app.needLogin && !store.getState().user.isLoginValid) {
      NativeDialog.showDialog({
        title: '请先登录',
        message: '请登录后再操作',
        hideCancelBtn: true,
        confirmBtnText: '登录',
        onConfirm() {
          nav.navigate(SCHOOL_AUTH)
        },
      })
      return
    }
    nav.navigate(app.path, app.routeParams)
  }
  return (
    <View style={styles.blockOuter}>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>{props.title}</Text>
        </View>
        <View style={styles.appOuter}>
          {props.applications.map((app, index) => (
            <Pressable
              key={index}
              onPress={() => pressEvent(app)}
              style={styles.appContainer}>
              <Image source={app.image} style={styles.appImage} />
              <Text style={styles.appTitleText}>{app.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  )
}

export default ApplicationCard
