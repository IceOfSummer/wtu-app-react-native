import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { RouterTypes } from '../../../router'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import styles from './styles'

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
}

const ApplicationCard: React.FC<ApplicationCardProps> = props => {
  const nav = useNavigation<NavigationProp<RouterTypes>>()
  return (
    <View style={styles.cardOuter}>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>{props.title}</Text>
        </View>
        <View style={styles.appOuter}>
          {props.applications.map((app, index) => (
            <Pressable
              key={index}
              onPress={() => nav.navigate(app.path, app.routeParams)}
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
