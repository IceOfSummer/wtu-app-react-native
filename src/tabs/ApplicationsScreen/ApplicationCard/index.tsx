import React from 'react'
import { Image, Text, View } from 'react-native'
import { RouterTypes } from '../../../router'
import TappableView from '../../../component/TappableView'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'
import styles from './styles'

interface ApplicationCardProps {
  title: string
  applications: Array<Application>
}

export interface Application {
  /**
   * 图片资源, 使用require导入
   */
  image: any
  title: string
  path: keyof RouterTypes
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
            <TappableView
              key={index}
              onTap={() => nav.navigate(app.path)}
              style={styles.appContainer}>
              <Image source={app.image} style={styles.appImage} />
              <Text style={styles.appTitleText}>{app.title}</Text>
            </TappableView>
          ))}
        </View>
      </View>
    </View>
  )
}

export default ApplicationCard
