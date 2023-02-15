import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { RouterTypes, SCHOOL_AUTH } from '../../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import styles from './styles'
import { useStore } from 'react-redux'
import NativeDialog from '../../../../native/modules/NativeDialog'
import BaseContainer from '../../../../component/Container/BaseContainer'
import { ReducerTypes } from '../../../../redux/counter'

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
        title: '请登录教务系统后再操作',
        message: '是否跳转到登录页面',
        confirmBtnText: '确定',
        onConfirm() {
          nav.navigate(SCHOOL_AUTH)
        },
      })
      return
    }
    nav.navigate(app.path, app.routeParams)
  }
  return (
    <BaseContainer>
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
    </BaseContainer>
  )
}

export default ApplicationCard
