import React from 'react'
import { Image, Text, View } from 'react-native'
import styles from './styles'
import { getVersion } from 'react-native-device-info'
import CardContainer from '../../component/Cards/CardContainer'
import NavigationCard from '../../component/Cards/NavigationCard'

const AboutPage: React.FC = () => {
  const version = getVersion()
  return (
    <View>
      <View style={styles.iconImageContainer}>
        <Image
          style={styles.iconImage}
          source={require('../../assets/img/icon.png')}
        />
        <Text>纺大智联</Text>
        <Text>v{version}</Text>
      </View>
      <CardContainer>
        <NavigationCard title="查看代码" />
        <NavigationCard title="捐赠" hideBorder />
      </CardContainer>
    </View>
  )
}

export default AboutPage
