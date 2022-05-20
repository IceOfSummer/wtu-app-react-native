import React from 'react'
import { Image, Linking, Pressable, Text, View } from 'react-native'
import styles from './styles'
import { getVersion } from 'react-native-device-info'
import CardContainer from '../../component/Cards/CardContainer'
import NavigationCard from '../../component/Cards/NavigationCard'
import NativeDialog from '../../native/modules/NativeDialog'

const AboutPage: React.FC = () => {
  const version = getVersion()
  return (
    <View style={{ height: '100%' }}>
      <View style={styles.iconImageContainer}>
        <Image
          style={styles.iconImage}
          source={require('../../assets/img/icon.png')}
        />
        <Text>武纺智联</Text>
        <Text>v{version}</Text>
      </View>
      <CardContainer>
        <NavigationCard
          title="查看代码"
          onTap={() => Linking.openURL(global.constant.homePageUrl)}
        />
        <NavigationCard
          title="捐赠"
          hideBorder
          onTap={() =>
            NativeDialog.showDialog({
              title: 'QAQ感谢您的好心',
              message: '目前暂时不需要暂时, 祝您用的开心',
              hideCancelBtn: true,
            })
          }
        />
      </CardContainer>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text
            style={{
              color: global.styles.$info_color,
              fontSize: global.styles.$font_size_sm,
            }}>
            Powered by
          </Text>
          <Pressable
            onPress={() =>
              Linking.openURL('https://github.com/facebook/react-native')
            }>
            <Text
              style={{
                color: global.styles.$primary_color,
                fontSize: global.styles.$font_size_sm,
              }}>
              &nbsp;React Native
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default AboutPage
